const Tutor = require('../models/Tutor');
const Course = require('../models/Course');
const { mongooseToObject } = require('../../util/mongoose');

class TutorController {
    // [GET] /tutor
    async showTutor(req, res, next) {
        try {
            const tutors = await Tutor.find({});
            res.json({ tutors: tutors.map(tutor => mongooseToObject(tutor)) });
        } catch (error) {
            next(error);
        }
    }

    // [GET] /tutors/:id
    async showTutorDetail(req, res, next) {
        try {
            const tutor = await Tutor.findById(req.params.id);
            const courses = await Course.find({ tutor_id: req.params.id });
            res.json({ 
                tutor: mongooseToObject(tutor), 
                courses: courses.map(course => mongooseToObject(course)) 
            });
        } catch (error) {
            next(error);
        }
    }

    // [GET] /courses
    async showCourse(req, res, next) {
        try {
            const courses = await Course.find({});
            res.json({ courses: courses.map(course => mongooseToObject(course)) });
        } catch (error) {
            next(error);
        }
    }

    // [GET] /courses/:id
    async showCourseDetail(req, res, next) {
        try {
            const course = await Course.findById(req.params.id);
            res.json({ course: mongooseToObject(course) });
        } catch (error) {
            next(error);
        }
    }

    // [PUT] /tutor/:id/approve
    async approveTutor(req, res, next) {
        try {
            const tutor = await Tutor.findByIdAndUpdate(
                req.params.id,
                { status: 'Đã duyệt' },
                { new: true }
            );
            if (!tutor) {
                return res.status(404).json({ message: 'Gia sư không tồn tại' });
            }
            res.json({ message: 'Gia sư đã được duyệt thành công', tutor: mongooseToObject(tutor) });
        } catch (error) {
            next(error);
        }
    }

    // [PUT] /course/:id/approve
    async approveCourse(req, res, next) {
        try {
            const course = await Course.findByIdAndUpdate(
                req.params.id,
                { status: 'Đã duyệt' },
                { new: true }
            );
            if (!course) {
                return res.status(404).json({ message: 'Khóa học không tồn tại' });
            }
            res.json({ message: 'Khóa học đã được duyệt thành công', course: mongooseToObject(course) });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new TutorController();