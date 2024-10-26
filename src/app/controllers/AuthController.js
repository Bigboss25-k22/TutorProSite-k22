const User = require('../models/user');

class AuthController {
    // [GET] /login
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
            const { username, email, password, address, dob, role, class: studentClass, school, student_card_image, education_level, degree_image, subjects } = req.body;
            const user = new User({
                username,
                email,
                password,
                address,
                dob,
                role,
                student: role === 'student' ? {
                    class: studentClass,
                    school,
                    student_card_image
                } : undefined,
                tuto: role === 'tuto' ? {
                    education_level,
                    degree_image,
                    subjects: subjects ? subjects.split(',') : []
                } : undefined
            });
            // Lưu thông tin người dùng vào cơ sở dữ liệu
            await user.save();
            // Chuyển hướng người dùng đến trang đăng nhập sau khi đăng ký thành công
            res.redirect('/login');
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AuthController();