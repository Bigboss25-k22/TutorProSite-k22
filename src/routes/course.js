const express = require('express');
const router = express.Router();

const courseController = require('../app/controllers/CourseController'); // Đảm bảo đường dẫn đúng
const { authenticateToken, authorizeRoles } = require('../app/middleware/auth.middleware');

router.get('/', courseController.show);

router.get('/create', authenticateToken, authorizeRoles('parent'), courseController.createCourseForm);
router.post('/create', authenticateToken, authorizeRoles('parent'), courseController.createCourse);

module.exports = router;
    