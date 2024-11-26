const express = require('express');
const router = express.Router();

const AdminController = require('../app/controllers/AdminController'); 
const { authenticateToken, authorizeRoles } = require('../app/middleware/auth.middleware');


router.get('/tutor', authenticateToken, authorizeRoles('admin'), AdminController.showTutor);
router.get('/course', authenticateToken, authorizeRoles('admin'), AdminController.showCourse);

router.get('/tutor/:id', authenticateToken, authorizeRoles('admin'), AdminController.showTutorDetail);
router.get('/course/:id', authenticateToken, authorizeRoles('admin'), AdminController.showCourseDetail);

router.put('/tutor/:id/approve', authenticateToken, authorizeRoles('admin'), AdminController.approveTutor);
router.put('/course/:id/approve', authenticateToken, authorizeRoles('admin'), AdminController.approveCourse);

module.exports = router;

