const Tutor = require('../models/Tutor'); 
const { mongooseToObject } = require('../../util/mongoose');
const { render } = require('node-sass');

class TutorController {
    async show(req, res, next) {
        try {
            // Lấy trang hiện tại và số lượng gia sư mỗi trang từ query parameters
            const page = parseInt(req.query.page) || 1; // Trang hiện tại
            const limit = parseInt(req.query.limit) || 2; // Số lượng gia sư mỗi trang
            const skip = (page - 1) * limit; // Tính số lượng gia sư cần bỏ qua
    
            // Đếm tổng số gia sư trong cơ sở dữ liệu
            const total = await Tutor.countDocuments({ status: 'Đã duyệt' });
    
            // Lấy danh sách gia sư với phân trang
            const tutors = await Tutor.find({ status: 'Đã duyệt' })
                                      .skip(skip)
                                      .limit(limit)
                                      .exec();
    
            // Tính tổng số trang
            const totalPages = Math.ceil(total / limit);
            console.log(tutors);
             // Trả về kết quả dưới dạng JSON hoặc render view tùy vào yêu cầu
            res.json ({
                tutors: tutors.map(tutor => mongooseToObject(tutor)), // Chuyển đổi Mongoose Object sang Object thông thường
                currentPage: page,
                totalPages: totalPages,
            });
           
          
        } catch (error) {
            console.error(error);
            next(error); // Gọi middleware lỗi nếu có
        }
    }
    async updateInforForm( req, res, next){
        res.render('/Tutor/updateInfo');
    }

    async updateInfor(req, res, next) {
        try {
            // Lấy ID của tutor hiện tại từ session hoặc JWT (giả sử req.user chứa thông tin tutor đang đăng nhập)
            const tutorId = req.user.id;
    
            // Lấy thông tin cần cập nhật từ form gửi lên
            const { name, address, introduction,phoneNumber, specialization } = req.body;
    
            // Tìm và cập nhật thông tin gia sư
            const updatedTutor = await Tutor.findByIdAndUpdate(
                tutorId, // ID của gia sư
                { 
                    name,
                    phoneNumber,
                    address,
                    introduction,
                    specialization,
                },
                { new: true, runValidators: true } // Trả về tutor sau khi cập nhật và kiểm tra validation
            );
    
            if (!updatedTutor) {
                // Nếu không tìm thấy gia sư
                return res.status(404).send("Tutor not found");
            }
    
            // Cập nhật thành công, chuyển hướng hoặc trả JSON
            res.redirect('/tutors'); // Redirect đến trang hồ sơ của gia sư (hoặc trang khác)
        } catch (error) {
            console.error(error);
            next(error); // Xử lý lỗi
        }
    }
    

}


module.exports = new TutorController();
