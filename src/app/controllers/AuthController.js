const User = require('../models/User');
const Tutor = require('../models/Tutor'); // Import Tutor model
const Parent = require('../models/Parent'); // Import Parent model

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
            const user = await User.findOne({ username, password });
    
            if (user) {
                // Kiểm tra vai trò của người dùng
                if (user.role === 'tutor') {
                    res.redirect('/courses');  // Trang danh sách khóa học cho tutor
                } else if (user.role === 'parent') {
                    res.redirect('/tutors');  // Trang danh sách gia sư cho parent
                } else {
                    res.redirect('/users');  // Trang mặc định nếu role không xác định
                }
            } else {
                res.render('auth/login', { error: 'Invalid email or password' });
            }
        } catch (error) {
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
                address,
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
