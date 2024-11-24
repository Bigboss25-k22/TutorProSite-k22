const Tutor = require('../models/Tutor'); 
const { mongooseToObject } = require('../../util/mongoose');

class TutorController {
    async show(req, res, next) {
        try {
            const tutors = await Tutor.find({});
            res.render('User/tutors', { tutors: tutors.map(tutor => mongooseToObject(tutor)) });
        } catch (error) {
            next(error);
        }
    }
}


module.exports = new TutorController();
