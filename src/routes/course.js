const express = require('express');
const router = express.Router();

const courseController = require('../app/controllers/CourseController'); 
const { authenticateToken, authorizeRoles } = require('../app/middleware/authmiddleware');

router.get('/my-courses', authenticateToken, courseController.getMyCourses);

// Register course
router.post('/register-Course', authenticateToken, authorizeRoles('tutor'), courseController.registerCourse);
router.get('/registrations', authenticateToken, authorizeRoles('tutor'), courseController.getMyPendingRegistrations);

//Detail course

//router.get('/create', authenticateToken, authorizeRoles('parent'), courseController.createCourseForm);
router.post('/create', authenticateToken, authorizeRoles('parent'), courseController.createCourse);

router.get('/filter',courseController.getFilteredCourses);
router.get('/search',courseController.SearchCourse);

router.get('/:slug',courseController.showDetail);

// [PUT] /courses/:slug - Cập nhật khóa học
router.put('/:slug/update',authenticateToken, authorizeRoles('parent'), courseController.updateCourses);

// [DELETE] /courses/:slug - Xóa khóa học
router.delete('/:slug/delete', authenticateToken, authorizeRoles('parent'),courseController.deleteCourses);

router.get('/', courseController.show);

module.exports = router;
     