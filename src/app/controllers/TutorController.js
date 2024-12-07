const Tutor = require('../models/Tutor'); 
const { mongooseToObject } = require('../../util/mongoose');

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
            res.render('User/tutors', {
                tutors: tutors.map(tutor => mongooseToObject(tutor)), // Chuyển đổi Mongoose Object sang Object thông thường
                currentPage: page,
                totalPages: totalPages,
            });
           
          
        } catch (error) {
            console.error(error);
            next(error); // Gọi middleware lỗi nếu có
        }
    }
}


module.exports = new TutorController();
