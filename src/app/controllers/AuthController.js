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
            const { email, password } = req.body; 
            const user = await User.findOne({ email }); 

            console.log(user);
            
            if (user && await bcrypt.compare(password, user.password)) { 
                let name = '';

                // Fetch the name based on the user's role
                if (user.role === 'tutor') {
                    const tutor = await Tutor.findOne({ _id: user._id });
                    if (tutor) {
                        name = tutor.name;
                    }
                } else if (user.role === 'parent') {
                    const parent = await Parent.findOne({ _id: user._id });
                    if (parent) {
                        name = parent.name;
                    }
                }

                // Generate a token
                const token = jwt.sign(
                    { id: user._id, role: user.role, name: name }, 
                    key.secret, 
                    { expiresIn: '1h' } 
                );
                
                user.password = undefined; 

                res.status(200).json({ 
                    message: "Đăng nhập thành công!",
                    token,
                    name,
                    _id:user._id,
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
            const { name, email, password, phoneNumber, address, role, introduction, specialization, sex,avatar,cardPhoto } = req.body;
    
            // Check if the email already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'Email đã được sử dụng.' }); // "Email is already in use."
            }
    
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
    
            // Create User and save to User collection
            const user = new User({
                name,
                password: hashedPassword,
                email,
                role,
                address,
                phoneNumber,
            });
    
            await user.save();
    
            // If role is 'parent', save to Parent collection
            if (role === 'parent') {
                const parent = new Parent({
                    _id: user._id,
                    name,
                    address,
                    phoneNumber,
                });
                await parent.save();
            }
    
            // If role is 'tutor', save to Tutor collection
            if (role === 'tutor') {
                const tutor = new Tutor({
                    _id: user._id,
                    name,
                    address,
                    phoneNumber,
                    introduction: introduction || '',
                    specialization: specialization || '',
                    rating: 0,
                    sex,
                    avatar,
                    cardPhoto, 
                });
                await tutor.save();
            }
    
            res.status(201).json({ message: 'Đăng ký thành công.' }); // "Registration successful."
        } catch (error) {
            console.error('Register error:', error);
            res.status(500).json({ message: 'Lỗi máy chủ nội bộ.' }); // "Internal server error."
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

    // [GET] /profile
    async profile(req, res, next) {
        try {
            const userId = req.user.id;

            // Fetch user from User model to get email and role
            const user = await User.findById(userId).select('email role');

            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }

            const userRole = user.role;

            let userInfo = {};

            // Fetch user details based on role
            if (userRole === 'tutor') {
                const tutor = await Tutor.findById(userId).select('name sex address phoneNumber dob');
                if (tutor) {
                    userInfo = {
                        "Họ và Tên": tutor.name,
                        "Vai trò": userRole,
                        "Ngày sinh": tutor.dob,
                        "Số điện thoại": tutor.phoneNumber,
                        "Email": user.email,
                        "Địa chỉ": tutor.address
                    };
                } else {
                    return res.status(404).json({ message: 'Tutor profile not found.' });
                }
            } else if (userRole === 'parent') {
                const parent = await Parent.findById(userId).select('name address phoneNumber dob');
                if (parent) {
                    userInfo = {
                        "Họ và Tên": parent.name,
                        "Vai trò": userRole,
                        "Ngày sinh": parent.dob,
                        "Số điện thoại": parent.phoneNumber,
                        "Email": user.email,
                        "Địa chỉ": parent.address
                    };
                } else {
                    return res.status(404).json({ message: 'Parent profile not found.' });
                }
            } else {
                return res.status(400).json({ message: 'Role không hợp lệ.' });
            }

            res.status(200).json(userInfo);
        } catch (error) {
            console.error('Error fetching profile:', error);
            res.status(500).json({ message: 'Lỗi máy chủ nội bộ.' });
        }
    }


    // [POST] /forgot-password
    async forgotPassword(req, res, next) {
        try {
            const { email } = req.body;
            const user = await User.findOne({ email });

            console.log(user); 

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
                message: 'Mã xác thực đã được gửi đến email của bạn. Vui lòng kiểm tra.'
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
    async verifyResetToken(req, res, next) {
        try {
            const { email, resetToken } = req.body;
    
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
    
            res.status(200).json({ 
                message: 'Mã xác thực hợp lệ.'
            });
        } catch (error) {
            console.error('Lỗi khi kiểm tra mã xác thực:', error);
            res.status(500).json({ 
                message: 'Đã xảy ra lỗi khi kiểm tra mã xác thực.'
            });
        }
    }
    
    /**
     * [POST] /verify-reset-token
     * Kiểm tra mã xác thực
     * Body: { email, resetToken }
     */
    async verifyResetToken(req, res, next) {
        try {
            const { email, resetToken } = req.body;

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

            res.status(200).json({ 
                message: 'Mã xác thực hợp lệ.'
            });
        } catch (error) {
            console.error('Lỗi khi kiểm tra mã xác thực:', error);
            res.status(500).json({ 
                message: 'Đã xảy ra lỗi khi kiểm tra mã xác thực.'
            });
        }
    }

    /**
     * [POST] /reset-password
     * Đặt lại mật khẩu dựa trên mã xác thực
     * Body: { email, newPassword }
     */
    async resetPassword(req, res, next) {
        try {
            const { email, newPassword } = req.body;

            // Tìm người dùng dựa trên email
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({ 
                    message: 'Không tìm thấy người dùng với email này.'
                });
            }

            // Hash mật khẩu mới
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
            await user.save();

            // Xóa token đã sử dụng
            await ResetToken.deleteMany({ userId: user._id });

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