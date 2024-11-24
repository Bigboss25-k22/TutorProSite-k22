const Course = require('../models/Course');
const { mongooseToObject } = require('../../util/mongoose');

class CourseController {
    async show(req, res, next) {
        try {
            const courses = await Course.find({});
            res.render('Course/courses', { courses: courses.map(course => mongooseToObject(course)) });
        } catch (error) {
            next(error);
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
            const { subject, grade, address, salary, sessions, schedule, studentInfo, requirements, teachingMode, contact } = req.body;

            // Tạo một đối tượng khóa học mới
            const newCourse = new Course({
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
                slug:subject,
            });

            // Lưu khóa học vào cơ sở dữ liệu
            await newCourse.save();

            // Chuyển hướng đến danh sách khóa học hoặc gửi phản hồi thành công
            res.redirect('/courses'); // Thay đổi đường dẫn nếu cần
        } catch (error) {
            next(error); // Gọi hàm next để xử lý lỗi
        }
    }
}


module.exports = new CourseController();