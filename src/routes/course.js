const express = require('express');
const router = express.Router();

const courseController = require('../app/controllers/CourseController'); 
const { authenticateToken, authorizeRoles } = require('../app/middleware/authmiddleware');

router.get('/', courseController.show);

//router.get('/create', authenticateToken, authorizeRoles('parent'), courseController.createCourseForm);
router.post('/create', authenticateToken, authorizeRoles('parent'), courseController.createCourse);

 router.get('/filter',courseController.getFilteredCourses);
 router.get('/search',courseController.SearchCourse);

 router.get('/:slug',courseController.showDetail);

module.exports = router;
     