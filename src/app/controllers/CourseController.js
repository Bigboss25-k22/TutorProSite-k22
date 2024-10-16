const Course = require('../models/Course');
const { mongooseToObject } = require('../../util/mongoose');

class CourseController {
    async show(req, res, next) {
        try {
            const courses = await Course.find({});
            res.json(courses.map(course => mongooseToObject(course)));
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new CourseController();