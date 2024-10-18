const express = require('express');
const router = express.Router();

const UserController = require('../app/controllers/UserController');

router.get('/student', UserController.showStudents);
router.get('/tuto', UserController.showTutos);
router.get('/create', UserController.create);
router.get('/', UserController.show);

module.exports = router;
