const Course = require('../models/Course');
const { mongooseToObject,multipleMongooseToObject } = require('../../util/mongoose');

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

    async SearchCourse(req, res, next) {
        try {
            const keyword = req.query.keyword || '';  // Từ khóa tìm kiếm khóa học
            const page = parseInt(req.query.page) || 1; // Trang hiện tại
            const limit = parseInt(req.query.limit) || 12; // Số lượng khóa học mỗi trang
            const skip = (page - 1) * limit; // Số khóa học bỏ qua tùy theo trang hiện tại
    
            // Truy vấn cơ sở dữ liệu để tìm khóa học theo từ khóa
            const courses = await Course.find({
                title: { $regex: keyword, $options: 'i' } // Tìm khóa học theo từ khóa không phân biệt hoa thường
            })
            .skip(skip)
            .limit(limit);
    
            // Lấy tổng số khóa học để phân trang
            const totalCourses = await Course.countDocuments({
                title: { $regex: keyword, $options: 'i' }
            });
    
            // Trả về dữ liệu khóa học và thông tin phân trang
            res.json({
                data: courses,
                pagination: {
                    total: totalCourses,
                    page,
                    limit,
                    totalPages: Math.ceil(totalCourses / limit)
                }
            });
        } catch (error) {
            next(error); // Đưa lỗi vào middleware xử lý lỗi
        }
    }
    

    // Lọc sản phẩm
    async getFilteredCourses(req, res, next) {
        try {
            const {
                subject:courseSubject,
                grade:courseGrade,
                address:courseAddress,
                teachingMode:courseTeachingMode,
                sexTutor:courseSexTutor,
                page = 1,
                limit = 12,
                keyword,
                
            } = req.query;

            const skip = (parseInt(page) - 1) * parseInt(limit);
            const filters = {};

            if (keyword) {
                filters.name = { $regex: keyword, $options: 'i' };
            }

            if (courseSubject) {
                const subjectArray = courseSubject.includes(',') ? courseSubject.split(',') : [courseSubject];
                filters.subject = { $in: subjectArray };
            }

            if (courseGrade) {
                const gradeArray = courseGrade.includes(',') ? courseGrade.split(',') : [courseGrade];
                filters.grade = { $in: gradeArray };
            }

            if (courseAddress) {
                const addressArray = courseAddress.includes(',') ? courseAddress.split(',') : [courseAddress];
                filters.address = { $in: addressArray };
            }

            if (courseTeachingMode) {
                const addressArray = courseTeachingMode.includes(',') ? courseTeachingMode.split(',') : [courseTeachingMode];
                filters.teachingMode = { $in: teachingModeArray };
            }

            if (courseSexTutor) {
                const sexTutorArray = courseSexTutor.includes(',') ? courseSexTutor.split(',') : [courseSexTutor];
                filters.sexTutor = { $in: sexTutorArray };
            }

        

          

            const total = await Course.countDocuments(filters);
            const courses = await Course.find(filters)              
                .skip(skip)
                .limit(parseInt(limit));

            res.json({
                courses: multipleMongooseToObject(courses),
                total,
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
            });
        } catch (error) {
            console.error('Error filtering courses:', error);
            res.status(500).json({ message: 'Error filtering courses', error });
        }
    }
}


module.exports = new CourseController();