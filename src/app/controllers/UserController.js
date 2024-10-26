const User = require('../models/user');
const { mongooseToObject, multipleMongooseToObject } = require('../../util/mongoose');

class UserController {
    // [GET] /users/student
    async showStudents(req, res, next) {

        try {
            const users = await User.find({role: 'student'});
            res.render('User/users', {
                title: 'List student of users',
                users: multipleMongooseToObject(users)
            });
        } catch (error) {
            next(error);
        }
    }
    

    // [GET] /users/tuto
    async showTutos(req, res, next) {
        try {
            const users = await User.find({ role: 'tuto' }); 
            res.render('User/users', {
                title: 'List tuto of users',
                users: multipleMongooseToObject(users)
            });
        } catch (error) {
            next(error); 
        }
    }

    // [GET] /users
    async show(req, res, next) {
        try {
            const users = await User.find(); 
            res.render('User/users', {
                title: 'List student of users',
                users: multipleMongooseToObject(users)
            });
        } catch (error) {
            next(error); 
        }
    }

    // [GET] /users/create
    create(req, res, next) {
        res.render('User/create');
    }

}

module.exports = new UserController();