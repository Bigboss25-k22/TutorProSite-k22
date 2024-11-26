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
                password: hashedPassword,
                email,
                role,
                slug: req.body.username,
            });
            //  res.json(user);
            await user.save();
          

            // Nếu là phụ huynh, lưu thêm vào bảng Parent
            if (role === 'parent') {
                const parent = new Parent({
                    username: user.username,
                    name,
                    username,
                    address,
                    phone_number,
                    slug:req.body.email,
                });
                await parent.save();
            }

            // Nếu là gia sư, lưu thêm vào bảng Tutor
            if (role === 'tutor') {
                const tutor = new Tutor({
                    username: user.username,
                    name,
                    username,
                    address,
                    introduction:req.body.introduction,
                    specialization:req.body.specialization,
                    rating: 0, 
                    slug:req.body.email,
                   
                });
                await tutor.save();
            }

           res.redirect('/login'); // Chuyển hướng về trang đăng nhập
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AuthController();