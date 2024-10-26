const User = require('../models/User');
const Tutor = require('../models/Tutor'); // Import Tutor model
const Parent = require('../models/Parent'); // Import Parent model

class AuthController {

    loginForm(req, res, next) {
        res.render('auth/login');
    }

    // [POST] /login
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email, password });
            if (user) {
                res.redirect('/users');
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
           // console.log(req.body);
            const { name, username, email, password, address, role, introduction, specialization } = req.body;

            // Tạo User và lưu vào bảng User
            const user = new User({
                username,
                email,
                password,
                address,
                role,
                slug: username.toLowerCase().replace(/\s+/g, '-')
            });
          //  res.json(req.body);
           // await user.save();

            // Nếu là phụ huynh, lưu thêm vào bảng Parent
            if (role === 'parent') {
                const parent = new Parent({
                    parent_id: user._id, // Liên kết với User
                    name,
                    username,
                    address
                });
               // await parent.save();
            }

            // Nếu là gia sư, lưu thêm vào bảng Tutor
            if (role === 'tutor') {
                const tutor = new Tutor({
                    tutor_id: user._id, // Liên kết với User
                    name,
                    username,
                    introduction,
                    specialization,
                    rating: 0, // Mặc định là 0
                    slug: username.toLowerCase().replace(/\s+/g, '-')
                });
              //  await tutor.save();
            }

            res.redirect('/login'); // Chuyển hướng về trang đăng nhập
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AuthController();
