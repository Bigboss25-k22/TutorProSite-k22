const User = require('../models/user');
const { mongooseToObject } = require('../../util/mongoose');

class UserController {
    async show(req, res, next) {
        try {
            const users = await User.find({});
            res.json(users.map(user => mongooseToObject(user)));
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new UserController();