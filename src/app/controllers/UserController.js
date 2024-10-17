const User = require('../models/user');
const { mongooseToObject } = require('../../util/mongoose');

class UserController {
    // [GET] /users/student
    async showStudents(req, res, next) {
        try {
            const users = await User.find({ role: 'student' }); 
            res.json(users.map(user => mongooseToObject(user))); 
        } catch (error) {
            next(error); 
        }
    }

    // [GET] /users/tuto
    async showTutos(req, res, next) {
        try {
            const users = await User.find({ role: 'tuto' }); 
            res.json(users.map(user => mongooseToObject(user))); 
        } catch (error) {
            next(error); 
        }
    }

    // [GET] /users
    async show(req, res, next) {
        try {
            const users = await User.find(); 
            res.json(users.map(user => mongooseToObject(user))); 
        } catch (error) {
            next(error); 
        }
    }

}

module.exports = new UserController();