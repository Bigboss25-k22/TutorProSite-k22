const express = require('express');
const router = express.Router();

const courseController = require('../app/controllers/CourseController'); 
const { authenticateToken, authorizeRoles } = require('../app/middleware/authmiddleware');



// Register course
router.post('/register-Course', authenticateToken, authorizeRoles('tutor'), courseController.registerCourse);

//Detail course

//router.get('/create', authenticateToken, authorizeRoles('parent'), courseController.createCourseForm);
router.post('/create', authenticateToken, authorizeRoles('parent'), courseController.createCourse);

router.get('/filter',courseController.getFilteredCourses);
router.get('/search',courseController.SearchCourse);

router.get('/:slug',courseController.showDetail);

router.get('/', courseController.show);

module.exports = router;
     