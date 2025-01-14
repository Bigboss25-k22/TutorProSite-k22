// services/emailService.js
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

// Tạo transporter với cấu hình SMTP
const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS  
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
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h1 style="color: #007BFF; text-align: center;">Yêu Cầu Đặt Lại Mật Khẩu</h1>
                <p>Bạn đã yêu cầu đặt lại mật khẩu. Sử dụng mã dưới đây để thiết lập mật khẩu mới:</p>
                <h2>${resetToken}</h2>
                <p>Mã xác thực này sẽ hết hạn sau 15 phút. Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p>
                <hr style="border: 1px solid #007BFF;">
                <p style="text-align: center; color: #007BFF;">Trân trọng,</p>
                <h2 style="text-align: center;">Trung tâm Gia Sư Đóm Con</h2>

                <hr style="border: 1px solid #007BFF;">
                <h2>Trung Tâm Gia sư Đóm Con</h2>
                <ul style="list-style: none; padding: 0;">
                    <li><strong>Số điện thoại:</strong> 0327357359</li>
                    <li><strong>Địa chỉ:</strong> Phường Linh Trung, Quận Thủ Đức, TP Hồ Chí Minh</li>
                </ul>
            </div>
        `
    };

    await transporter.sendMail(mailOptions);
};

const sendApprovalEmail = async (email, courseDetails) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Trung Tâm Gia Sư Đóm Con Thông Báo Chấp Nhận Đăng Ký Dạy Học',
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h1 style="color: #007BFF; text-align: center;">Chấp Nhận Đăng Ký</h1>
                <p>Chúc mừng! Đăng ký của bạn cho khóa học <strong>${courseDetails.subject}</strong> đã được chấp nhận.</p>
                <hr style="border: 1px solid #007BFF;">
                <h2>Thông tin khóa học:</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Môn học:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${courseDetails.subject}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Lớp dạy:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${courseDetails.grade}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Học phí:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${Number(courseDetails.salary).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Số buổi:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${courseDetails.sessions}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Thời gian:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${courseDetails.schedule}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Hình thức:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${courseDetails.teachingMode}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Yêu cầu:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${courseDetails.requirements}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Giới tính gia sư:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${courseDetails.sexTutor}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Phí:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${Number(courseDetails.fee).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                    </tr>
                </table>
                <hr style="border: 1px solid #007BFF;">
                <p>
                    Vui lòng truy cập trang web của trung tâm và thanh toán khoản phí trong vòng 
                    <strong>1 ngày tới</strong> để hoàn tất quá trình đăng ký.
                </p>
                <p>
                    Sau khi thanh toán, trung tâm sẽ xử lý và xác nhận lớp cho bạn. Nếu có thắc mắc, vui lòng liên hệ với trung tâm để được hỗ trợ.
                </p>
                <p style="text-align: center; color: #007BFF;">Trân trọng,</p>
                <h2 style="text-align: center;">Trung tâm Gia Sư Đóm Con</h2>

                <hr style="border: 1px solid #007BFF;">
                <h2>Trung Tâm Gia sư Đóm Con</h2>
                <ul style="list-style: none; padding: 0;">
                    <li><strong>Số điện thoại:</strong> 0327357359</li>
                    <li><strong>Địa chỉ:</strong> Phường Linh Trung, Quận Thủ Đức, TP Hồ Chí Minh</li>
                </ul>
            </div>
        `
    };
    
    await transporter.sendMail(mailOptions);
};

const sendCourseApprovalEmail = async (email, courseDetails) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Trung Tâm Gia Sư Đóm Con Thông Báo Chấp Nhận Khóa Học',
        html: ` 
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h1 style="color: #007BFF; text-align: center;">Chấp Nhận Khóa Học</h1>
                <p>Chúc mừng! Khóa học của bạn <strong>${courseDetails.subject}</strong> đã được chấp nhận.</p>
                <hr style="border: 1px solid #007BFF;">
                <h2>Thông tin khóa học:</h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Môn học:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${courseDetails.subject}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Lớp dạy:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${courseDetails.grade}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Học phí:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${Number(courseDetails.salary).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Số buổi:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${courseDetails.sessions}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Thời gian:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${courseDetails.schedule}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Hình thức:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${courseDetails.teachingMode}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Yêu cầu:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${courseDetails.requirements}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Giới tính gia sư:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${courseDetails.sexTutor}</td>
                    </tr>
                    <tr>
                        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Phí:</strong></td>
                        <td style="padding: 8px; border: 1px solid #ddd;">${Number(courseDetails.fee).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</td>
                    </tr>
                </table>
                <hr style="border: 1px solid #007BFF;">
                <p>
                    Vui lòng truy cập trang web của trung tâm và kiểm tra lại thông tin khóa học.
                </p>
                <p style="text-align: center; color: #007BFF;">Trân trọng,</p>
                <h2 style="text-align: center;">Trung tâm Gia Sư Đóm Con</h2>

                <hr style="border: 1px solid #007BFF;">
                <h2>Trung Tâm Gia sư Đóm Con</h2>
                <ul style="list-style: none; padding: 0;">
                    <li><strong>Số điện thoại:</strong> 0327357359</li>
                    <li><strong>Địa chỉ:</strong> Phường Linh Trung, Quận Thủ Đức, TP Hồ Chí Minh</li>
                </ul>
            </div>
        `
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { sendResetCodeEmail, sendApprovalEmail ,sendCourseApprovalEmail};