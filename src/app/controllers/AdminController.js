const Tutor = require('../models/Tutor');
const Course = require('../models/Course');
const { mongooseToObject } = require('../../util/mongoose');
const Registration = require('../models/Registration');

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

    // [GET] /course/register
    async ShowregisterCourse(req, res, next) {
        try {
            // Find all registrations and populate userId with Tutor model
            const registrations = await Registration.find({}).populate('userId', 'name email'); // Assuming 'name' and 'email' are fields in Tutor model

            // Group registrations by courseId
            const courses = {};
            registrations.forEach(registration => {
                const courseId = registration.courseId;
                if (!courses[courseId]) {
                    courses[courseId] = {
                        courseId: courseId,
                        tutors: []
                    };
                }
                courses[courseId].tutors.push({
                    tutor: registration.userId,
                    registeredAt: registration.registeredAt
                });
            });

            // Convert courses object to array
            const coursesArray = Object.values(courses);

            // Return the grouped data
            res.json(coursesArray.map(course => ({
                courseId: course.courseId,
                tutors: course.tutors.map(tutor => ({
                    tutor: mongooseToObject(tutor.tutor),
                    registeredAt: tutor.registeredAt
                }))
            })));
        } catch (error) {
            next(error);
        }
    }


}

module.exports = new TutorController();