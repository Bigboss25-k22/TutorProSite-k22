const Course = require('../models/Course');
const { mongooseToObject,multipleMongooseToObject } = require('../../util/mongoose');
const Registration = require('../models/Registration');
const user = require('../models/user');

class CourseController {
   
    
    // [GET] /courses
async show(req, res, next) {
    try {
        const {
            page = 1,
            limit = 10,
            keyword,
            subject,
            grade,
            teachingMode,
            sexTutor,
        } = req.query;

        const filters = { status: 'Đã duyệt' };

        // Thêm tìm kiếm theo từ khóa
        if (keyword) {
            filters.$or = [
                { subject: { $regex: keyword, $options: 'i' } },
                { grade: { $regex: keyword, $options: 'i' } },
                { teachingMode: { $regex: keyword, $options: 'i' } },
                { sexTutor: { $regex: keyword, $options: 'i' } },
            ];
        }

        // Thêm lọc
        if (subject) filters.subject = { $in: subject.split(',') };
        if (grade) filters.grade = { $in: grade.split(',') };
        if (teachingMode) filters.teachingMode = { $in: teachingMode.split(',') };
        if (sexTutor) filters.sexTutor = { $in: sexTutor.split(',') };

        const total = await Course.countDocuments(filters);
        const courses = await Course.find(filters)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        
        res.json( {
            courses: multipleMongooseToObject(courses),
            total,
            currentPage: parseInt(page),
            totalPages: Math.ceil(total / limit),
            keyword,
            subject,
            grade,
            teachingMode,
            sexTutor,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
}

    async showDetail(req, res, next) {
        try {
            const slug = req.params.slug; // Lấy slug từ URL
            const course = await Course.findOne({ slug });
    
            if (!course) {
                return res.status(404).json({ message: "Course not found" });
            }
    
            res.json({
                course: mongooseToObject(course),
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error retrieving course details', error });
        }
    }
    
    // [POST] /create
    async createCourse(req, res, next) {
        try {
            const {
                 subject, grade, address, salary, sessions, schedule, 
                studentInfo, requirements, teachingMode, contact, sexTutor
            } = req.body;
    
            const newCourse = new Course({
                parent_id:req.user.id, 
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
                sexTutor,
               fee:salary*0.4,
            });
    
            await newCourse.save();
    
            res.status(201).json({ message: 'Course created successfully', course: mongooseToObject(newCourse) });
        } catch (error) {
            next(error);
        }
    }
    

    
  
    async registerCourse(req, res, next) {
        try {
            // Get tutor ID from session or JWT (assuming req.user contains the logged-in tutor's info)
            const tutorId = req.user.id;

            // Get course ID from the request body
            const { courseId } = req.body;

            // Create a new registration entry
            const newRegistration = new Registration({
                userId: tutorId,
                courseId: courseId,
                status: 'Chờ duyệt',
            });

            await newRegistration.save();

            // Registration successful, send JSON response
            res.status(200).json({ message: 'Đăng ký khóa học thành công' });
        } catch (error) {
            console.error(error);
            next(error); // Handle error
        }
    }
    
    // [GET] /search
async SearchCourse(req, res, next) {
    try {
        const {
            keyword = '',
            page = 1,
            limit = 10,
            subject,
            grade,
            address,
            teachingMode,
            sexTutor,
        } = req.query;

        // Chuyển đổi trang và limit sang số
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        const skip = (pageNumber - 1) * limitNumber;

        // Tạo bộ lọc
        const filters = {};

        if (keyword) {
            filters.$or = [
                { title: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } },
            ];
        }
        if (subject) filters.subject = { $in: subject.split(',') };
        if (grade) filters.grade = { $in: grade.split(',') };
        if (address) filters.address = { $in: address.split(',') };
        if (teachingMode) filters.teachingMode = { $in: teachingMode.split(',') };
        if (sexTutor) filters.sexTutor = { $in: sexTutor.split(',') };

        // Lấy dữ liệu và tổng số khóa học
        const [courses, totalCourses] = await Promise.all([
            Course.find(filters).skip(skip).limit(limitNumber),
            Course.countDocuments(filters),
        ]);

        res.json({
            data: multipleMongooseToObject(courses),
            pagination: {
                total: totalCourses,
                page: pageNumber,
                limit: limitNumber,
                totalPages: Math.ceil(totalCourses / limitNumber),
            },
        });
    } catch (error) {
        console.error('Error searching courses:', error);
        res.status(500).json({ message: 'Error searching courses', error });
        next(error);
    }
}

   // [GET] /filter
   async getFilteredCourses(req, res, next) {
    try {
        const {
            keyword ,
            subject,
            grade,
            address,
            teachingMode,
            sexTutor,
            page = 1,
            limit = 10,
        } = req.query;
        //console.log(keyword);
        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        const skip = (pageNumber - 1) * limitNumber;

        const filters = {};

        // Tìm kiếm từ khóa (nhiều trường)
        if (keyword) {
            filters.$or = [
                { subject: { $regex: keyword, $options: 'i' } },
                { sexTutor: { $regex: keyword, $options: 'i' } },
            ];
        }
        if (subject) filters.subject = { $in: subject.split(',') };
        if (grade) filters.grade = { $in: grade.split(',') };
        if (address) filters.address = { $in: address.split(',') };
        if (teachingMode) filters.teachingMode = { $in: teachingMode.split(',') };
        if (sexTutor) filters.sexTutor = { $in: sexTutor.split(',') };

        // Lấy dữ liệu và tổng số khóa học
        const [courses, total] = await Promise.all([
            Course.find( {...filters,
                status: 'Đã duyệt',}).skip(skip).limit(limitNumber),
            Course.countDocuments(filters),
        ]);

        res.json({
            courses: multipleMongooseToObject(courses),
            pagination: {
                total,
                currentPage: pageNumber,
                totalPages: Math.ceil(total / limitNumber),
            },
        });
    } catch (error) {
        console.error('Error filtering courses:', error);
        res.status(500).json({ message: 'Error filtering courses', error });
        next(error);
    }
}


 // [PUT] /update
async updateCourses(req, res, next) {
    try {
        const { slug } = req.params; // Lấy slug từ URL
        const updateData = req.body; // Dữ liệu cập nhật từ body
        const parentId = req.user.id; // Lấy parent_id từ người dùng hiện tại

        // Tìm khóa học theo slug
        const course = await Course.findOne({ slug });
        if (!course) {
            return res.status(404).json({ message: 'Khóa học không tồn tại' });
        }

        // Kiểm tra trạng thái
        if (course.status !== 'Chưa duyệt') {
            return res.status(400).json({ message: 'Khóa học đã được duyệt, không thể cập nhật' });
        }

        // Kiểm tra quyền sở hữu
        if (course.parent_id !== parentId) {
            return res.status(403).json({ message: 'Bạn không có quyền cập nhật khóa học này' });
        }

        // Cập nhật khóa học
        Object.assign(course, updateData);
        await course.save();

        res.status(200).json({
            message: 'Cập nhật khóa học thành công',
            course: mongooseToObject(course),
        });
    } catch (error) {
        console.error('Error updating course:', error);
        res.status(500).json({ message: 'Lỗi khi cập nhật khóa học', error });
    }
}

    
// [DELETE] /delete
async deleteCourses(req, res, next) {
    try {
        const { slug } = req.params; // Lấy slug từ URL
        const parentId = req.user.id; // Lấy parent_id từ người dùng hiện tại

        // Tìm khóa học theo slug
        const course = await Course.findOne({ slug });
        if (!course) {
            return res.status(404).json({ message: 'Khóa học không tồn tại' });
        }

        // Kiểm tra trạng thái
        if (course.status !== 'Chưa duyệt') {
            return res.status(400).json({ message: 'Khóa học đã được duyệt, không thể xóa' });
        }

        // Kiểm tra quyền sở hữu
        if (course.parent_id !== parentId) {
            return res.status(403).json({ message: 'Bạn không có quyền xóa khóa học này' });
        }

        // Xóa khóa học
        await Course.deleteOne({ slug });

        res.status(200).json({
            message: 'Xóa khóa học thành công',
        });
    } catch (error) {
        console.error('Error deleting course:', error);
        res.status(500).json({ message: 'Lỗi khi xóa khóa học', error });
    }
}

    
}

module.exports = new CourseController();
