const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User'); // Adjust the path as necessary
const key = require('../../config/auth.config'); // Adjust the path as necessary

class AuthController {

    home(req, res, next) {
        res.render('home');
    }

    loginForm(req, res, next) {
        res.render('auth/login');
    }

    async login(req, res, next) {
        try {
            const { username, password } = req.body; // Extract username and password from the request body
            const user = await User.findOne({ username }); // Find the user by username
    
            if (user && await bcrypt.compare(password, user.password)) { // Check if the user exists and the password is correct
                // Generate a token
                const token = jwt.sign(
                    { id: user._id, role: user.role }, // Payload: user ID and role
                    key.secret, // Secret key for signing the token
                    { expiresIn: '1h' } // Token expiration time
                );
    
                user.password = undefined; // Remove the password from the user object
    
                res.status(200).json({ // Use res.status(200).json to send the response
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
                slug: req.body.username,
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
                    phone_number,
                    slug:req.body.email,
                });
                await parent.save();
            }

            // Nếu là gia sư, lưu thêm vào bảng Tutor
            if (role === 'tutor') {
                const tutor = new Tutor({
                    _id: user._id, // Liên kết với User
                    name,
                    username,
                    email,  
                    address,
                    introduction:req.body.introduction,
                    specialization:req.body.specialization,
                    rating: 0, // Mặc định là 0
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