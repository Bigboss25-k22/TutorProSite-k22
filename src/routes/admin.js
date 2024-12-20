const express = require('express');
const router = express.Router();

const AdminController = require('../app/controllers/AdminController'); 

router.get('/course/register', AdminController.ShowregisterCourse);
router.post('/course/register', AdminController.approveRegister);

router.put('/tutor/:id/approve', AdminController.approveTutor);
router.put('/course/:id/approve', AdminController.approveCourse);

router.put('/tutor/:id', AdminController.updateTutor);
router.put('/course/:id', AdminController.updateCourse);
router.put('/parent/:id', AdminController.updateParent);

router.delete('/tutor/:id', AdminController.deleteTutor);
router.delete('/course/:id', AdminController.deleteCourse);
router.delete('/parent/:id', AdminController.deleteParent);

router.get('/tutor/:id', AdminController.showTutorDetail);
router.get('/course/:id', AdminController.showCourseDetail);

router.get('/tutor', AdminController.showTutor);
router.get('/course', AdminController.showCourse);
router.get('/parent', AdminController.showParent);


module.exports = router;

