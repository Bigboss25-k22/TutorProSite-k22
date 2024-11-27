const Course = require('../models/Course');
const { mongooseToObject } = require('../../util/mongoose');

class CourseController {
    async show(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1; // Trang hiện tại
            const limit = parseInt(req.query.limit) || 2; // Số lượng khóa học mỗi trang
            const skip = (page - 1) * limit; // Số lượng bỏ qua để lấy trang hiện tại
    
            // Đếm tổng số khóa học
            const total = await Course.countDocuments({ status: 'Đã duyệt' });
    
            // Lấy danh sách khóa học với phân trang
            const courses = await Course.find({ status: 'Đã duyệt' })
                                     .skip(skip)
                                     .limit(limit);
    
            // Tính tổng số trang
            const totalPages = Math.ceil(total / limit);
            // console.log('Current Page:', page);
            // console.log('Total Pages:', totalPages);

            // Trả về danh sách khóa học và thông tin phân trang
            res.render('Course/courses', {
                courses: courses.map(course => mongooseToObject(course)), // Chuyển đổi Mongoose Object sang Object thông thường
                currentPage: page,
                totalPages: totalPages,
            });
        } catch (error) {
            next(error); // Xử lý lỗi
        }
    }
    
     // [GET] /create
    createCourseForm(req, res, next){
        res.render('Course/create');
    }
    
     // [POST] /create
    async createCourse(req, res, next) {
        try {
            // Lấy dữ liệu từ body của yêu cầu
            const { parent_id, subject, grade, address, salary, sessions, schedule, studentInfo, requirements, teachingMode, contact } = req.body;

            // Tạo một đối tượng khóa học mới
            const newCourse = new Course({
                parent_id, 
                tutor_id: null,
                subject,
                grade,
                address,
                salary,
                sessions,
                schedule,
                studentInfo,
                requirements,
                teachingMode,
                contact,
                slug: subject,
            });

            // Lưu khóa học vào cơ sở dữ liệu
            await newCourse.save();

            // Gửi phản hồi thành công
            res.status(201).json({ message: 'Course created successfully'});
        } catch (error) {
            next(error); // Gọi hàm next để xử lý lỗi
        }
    }
}


module.exports = new CourseController();