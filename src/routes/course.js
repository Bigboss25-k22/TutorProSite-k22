const express = require('express');
const router = express.Router();

const courseController = require('../app/controllers/CourseController'); // Đảm bảo đường dẫn đúng

// Route lấy danh sách gia sư
router.get('/', courseController.show);
router.get('/create', courseController.createCourseForm);
router.post('/create', courseController.createCourse);

module.exports = router;
    