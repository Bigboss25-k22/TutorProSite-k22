const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Tutor = require('../models/Tutor');  
const Parent = require('../models/Parent');
const User = require('../models/user'); 

const key = require('../../config/auth.config');
const ResetToken = require('../models/ResetToken');
const crypto = require('crypto');

const { sendResetCodeEmail } = require('../services/emailService');

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
            const { name, username, email, password, phone_number, address, role, introduction, specialization } = req.body;

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Tạo User và lưu vào bảng User
            const user = new User({
                username,
                password: hashedPassword,
                email,
                role,
            });
            await user.save();

            // Nếu là phụ huynh, lưu thêm vào bảng Parent
            if (role === 'parent') {
                const parent = new Parent({
                    name,
                    address,
                    phone_number,
                    slug: username,
                });
                await parent.save();
            }

            // Nếu là gia sư, lưu thêm vào bảng Tutor
            if (role === 'tutor') {
                const tutor = new Tutor({
                    name,
                    address,
                    phone_number,
                    introduction: req.body.introduction || '', 
                    specialization: req.body.specialization || '', 
                    rating: 0, 
                });
                await tutor.save(); 
            }

            res.redirect('/login'); // Chuyển hướng về trang đăng nhập
        } catch (error) {
            next(error);
        }
    }

        // Các phương thức hiện tại của AuthController...


    // [POST] /forgot-password
    async forgotPassword(req, res, next) {
        try {
            const { email } = req.body;
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({ message: 'Email không tồn tại trong hệ thống.' });
            }

            // Tạo mã xác thực (ví dụ: 6 chữ số ngẫu nhiên)
            const resetToken = crypto.randomInt(100000, 999999).toString();

            // Lưu mã xác thực vào cơ sở dữ liệu
            await ResetToken.create({
                userId: user._id,
                token: resetToken,
            });

            // Gửi email chứa mã xác thực
            await sendResetCodeEmail(email, resetToken);

            res.status(200).json({ 
                message: 'Mã xác thực đã được gửi đến email của bạn. Vui lòng kiểm tra và nhập mã để đặt lại mật khẩu.'
            });
        } catch (error) {
            console.error('Lỗi khi gửi yêu cầu đặt lại mật khẩu:', error);
            res.status(500).json({ 
                message: 'Đã xảy ra lỗi khi xử lý yêu cầu.'
            });
        }
    }

    /**
     * [POST] /reset-password
     * Đặt lại mật khẩu dựa trên mã xác thực
     * Body: { email, resetToken, newPassword }
     */
    async resetPassword(req, res, next) {
        try {
            const { email, resetToken, newPassword } = req.body;

            // Tìm người dùng dựa trên email
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({ 
                    message: 'Không tìm thấy người dùng với email này.'
                });
            }

            // Tìm mã xác thực hợp lệ
            const tokenDoc = await ResetToken.findOne({ 
                userId: user._id, 
                token: resetToken 
            });

            if (!tokenDoc) {
                return res.status(400).json({ 
                    message: 'Mã xác thực không hợp lệ hoặc đã hết hạn.'
                });
            }

            // Hash mật khẩu mới
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
            await user.save();

            // Xóa token đã sử dụng
            await ResetToken.deleteOne({ _id: tokenDoc._id });

            res.status(200).json({ 
                message: 'Mật khẩu đã được đặt lại thành công. Bạn có thể đăng nhập với mật khẩu mới.'
            });
        } catch (error) {
            console.error('Lỗi khi đặt lại mật khẩu:', error);
            res.status(500).json({ 
                message: 'Đã xảy ra lỗi khi đặt lại mật khẩu.'
            });
        }
    }   

}

module.exports = new AuthController();