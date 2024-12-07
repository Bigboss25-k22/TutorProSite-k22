const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Tutor = require('../models/Tutor');  
const Parent = require('../models/Parent');
const User = require('../models/User'); 
const key = require('../../config/auth.config'); 
class AuthController {

    home(req, res, next) {
        res.render('home');
    }

    loginForm(req, res, next) {
        res.render('auth/login');
    }

    // [POST] /login
    async login(req, res, next) {
        try {
            const { username, password } = req.body; 
            const user = await User.findOne({ username }); 
    
            if (user && await bcrypt.compare(password, user.password)) { 
                // Generate a token
                const token = jwt.sign(
                    { id: user._id, role: user.role }, 
                    key.secret, 
                    { expiresIn: '1h' } 
                );
    
                user.password = undefined; 
    
                res.status(200).json({ 
                    message: "Đăng nhập thành công!",
                    user,
                    token
                });
            } else {
                res.status(401).json({ error: 'Invalid email or password' }); 
            }
        } catch (error) {
            console.error('Error during login:', error); 
            next(error); 
        }
    }
    
    // [GET] /register
    registerForm(req, res, next) {
        res.render('auth/register');
    }

    // [POST] /register
    async register(req, res, next) {
        try {
          
            const { name, username, email, password,phone_number, address, role, introduction, specialization } = req.body;
            const saltRounds = 10; // You can adjust the number of salt rounds as needed
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            // Tạo User và lưu vào bảng User
            const user = new User({
                username,
                password:hashedPassword,
                email,
                role,
               
            });
        //  res.json(user);
            await user.save();
          

            // Nếu là phụ huynh, lưu thêm vào bảng Parent
            if (role === 'parent') {
                const parent = new Parent({
                    _id: user._id,
                    name,
                    username,
                    email,  
                    address,
                  
                 
                });
                await parent.save();
            }

            // Nếu là gia sư, lưu thêm vào bảng Tutor
            if (role === 'tutor') {
                console.log('Role is tutor:', role); // Thêm log để kiểm tra
                const tutor = new Tutor({
                    _id: user._id, // Liên kết với User
                    name,
                    username,
                    email,
                    address,
                    phone_number,
                    introduction: req.body.introduction || '', // Đảm bảo trường không bị undefined
                    specialization: req.body.specialization || '', // Đảm bảo trường không bị undefined
                    rating: 0, // Mặc định là 0
                    
                });
            
                console.log('Tutor Object:', tutor); // Log đối tượng trước khi lưu
            
                await tutor.save();
                console.log('Tutor saved successfully!');
            
            
            }

           res.redirect('/login'); // Chuyển hướng về trang đăng nhập
        } catch (error) {
            next(error);
        }
    }


    updatePasswordForm(req, res, next) {
        res.render('auth/updatePassword');
    }

    // Hàm đổi mật khẩu
    async  updatePassword(req, res, next) {
        try {
            const userId = req.user.id; // Lấy ID người dùng từ token
            console.log(userId);
            const { oldPassword, newPassword } = req.body;
            
            // Tìm người dùng trong cơ sở dữ liệu
            const user = await User.findById(userId);
            
            if (!user) {
                return res.status(404).send({ message: 'User not found.' });
            }
            
            // So sánh mật khẩu cũ với mật khẩu trong cơ sở dữ liệu
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            
            if (!isMatch) {
                return res.status(400).send({ message: 'Old password is incorrect.' });
            }
            
            // Hash mật khẩu mới
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            
            // Cập nhật mật khẩu mới cho người dùng
            user.password = hashedPassword;
            await user.save();
            
            return res.status(200).send({ message: 'Password updated successfully.' });
        } catch (err) {
            console.error(err);
            return res.status(500).send({ message: 'Error updating password.' });
        }
    }

    
}

module.exports = new AuthController();