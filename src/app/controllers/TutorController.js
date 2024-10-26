const Tutor = require('../models/Tutor'); // Đảm bảo đường dẫn đúng
const { mongooseToObject } = require('../../util/mongoose');

class TutorController {
    // Lấy danh sách tất cả các gia sư
    async show(req, res, next) {
        try {
            const tutors = await Tutor.find({});
            res.json(tutors.map(tutor => mongooseToObject(tutor)));
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new TutorController();
