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

            // Tạo User và lưu vào bảng User
            const user = new User({
                username,
                password,
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
}

module.exports = new AuthController();