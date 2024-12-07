// services/emailService.js
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

// Tạo transporter với cấu hình SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail', // Hoặc bất kỳ dịch vụ email nào bạn muốn sử dụng
    auth: {
        user: process.env.EMAIL_USER, // Email của bạn
        pass: process.env.EMAIL_PASS  // Mật khẩu ứng dụng hoặc mật khẩu email
    }
});

/**
 * Gửi email chứa mã xác thực đặt lại mật khẩu
 * @param {string} email - Địa chỉ email người dùng
 * @param {string} resetToken - Mã xác thực đặt lại mật khẩu
 */
const sendResetCodeEmail = async (email, resetToken) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Mã Xác Thực Đặt Lại Mật Khẩu',
        html: `
            <h1>Yêu Cầu Đặt Lại Mật Khẩu</h1>
            <p>Bạn đã yêu cầu đặt lại mật khẩu. Sử dụng mã dưới đây để thiết lập mật khẩu mới:</p>
            <h2>${resetToken}</h2>
            <p>Mã xác thực này sẽ hết hạn sau 15 phút. Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p>
        `
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { sendResetCodeEmail };