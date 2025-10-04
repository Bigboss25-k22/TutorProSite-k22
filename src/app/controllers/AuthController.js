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
                    _id: user._id,
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
            const { name, email, password, phoneNumber, address, role, introduction, specialization, sex, avatar, cardPhoto } = req.body;

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'Email đã được sử dụng.' });
            }

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const user = new User({
                name,
                password: hashedPassword,
                email,
                role,
                address,
                phoneNumber,
            });

            await user.save();

            if (role === 'parent') {
                const parent = new Parent({
                    _id: user._id,
                    name,
                    address,
                    phoneNumber,
                });
                await parent.save();
            }

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

            res.status(201).json({ message: 'Đăng ký thành công.' });
        } catch (error) {
            console.error('Register error:', error);
            res.status(500).json({ message: 'Lỗi máy chủ nội bộ.' });
        }
    }



    updatePasswordForm(req, res, next) {
        res.render('auth/updatePassword');
    }

    // Hàm đổi mật khẩu
    async updatePassword(req, res, next) {
        try {
            const userId = req.user.id;
            console.log(userId);
            const { oldPassword, newPassword } = req.body;

            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).send({ message: 'User not found.' });
            }

            const isMatch = await bcrypt.compare(oldPassword, user.password);

            if (!isMatch) {
                return res.status(400).send({ message: 'Old password is incorrect.' });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);

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

            const user = await User.findById(userId).select('email role');

            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }

            const userRole = user.role;

            let userInfo = {};

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

    // [POST] /profile/edit
    async editProfile(req, res, next) {
        try {
            const userId = req.user.id;

            const user = await User.findById(userId).select('role');
            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }

            const userRole = user.role;
            const updateData = req.body;

            if (userRole === 'tutor') {
                const updatedTutor = await Tutor.findByIdAndUpdate(userId, updateData, { new: true }).select('name sex address phoneNumber dob');
                if (!updatedTutor) {
                    return res.status(404).json({ message: 'Tutor profile not found.' });
                }

                const updatedProfile = {
                    "Họ và Tên": updatedTutor.name,
                    "Vai trò": userRole,
                    "Ngày sinh": updatedTutor.dob,
                    "Số điện thoại": updatedTutor.phoneNumber,
                    "Email": user.email,
                    "Địa chỉ": updatedTutor.address
                };

                res.status(200).json(updatedProfile);
            } else if (userRole === 'parent') {
                const updatedParent = await Parent.findByIdAndUpdate(userId, updateData, { new: true }).select('name address phoneNumber dob');
                if (!updatedParent) {
                    return res.status(404).json({ message: 'Parent profile not found.' });
                }

                const updatedProfile = {
                    "Họ và Tên": updatedParent.name,
                    "Vai trò": userRole,
                    "Ngày sinh": updatedParent.dob,
                    "Số điện thoại": updatedParent.phoneNumber,
                    "Email": user.email,
                    "Địa chỉ": updatedParent.address
                };

                res.status(200).json(updatedProfile);
            } else {
                return res.status(400).json({ message: 'Role không hợp lệ.' });
            }
        } catch (error) {
            console.error('Error editing profile:', error);
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

            const reset = ResetToken.findOne({ userId: user._id });

            if (reset) {
                ResetToken.deleteOne({ userId: user._id });
            }

            const resetToken = crypto.randomInt(100000, 999999).toString();

            const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

            await ResetToken.create({
                userId: user._id,
                token: resetToken,
                expiresAt: expiresAt
            });

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

    async verifyResetToken(req, res, next) {
        try {
            const { email, resetToken } = req.body;

            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({
                    message: 'Không tìm thấy người dùng với email này.'
                });
            }

            const tokenDoc = await ResetToken.findOne({
                userId: user._id,
                token: resetToken
            });

            if (!tokenDoc) {
                return res.status(400).json({
                    message: 'Mã xác thực không hợp lệ hoặc đã hết hạn.'
                });
            }

            if (tokenDoc.expiresAt < new Date()) {
                return res.status(400).json({
                    message: 'Mã xác thực đã hết hạn.'
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

    async resetPassword(req, res, next) {
        try {
            const { email, newPassword } = req.body;

            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({
                    message: 'Không tìm thấy người dùng với email này.'
                });
            }

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
            await user.save();

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