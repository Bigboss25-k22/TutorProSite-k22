const express = require('express');
const router = express.Router();

const parentController = require('../app/controllers/ParentController');
const { authenticateToken, authorizeRoles } = require('../app/middleware/authmiddleware');

router.get('/updateInfo', authenticateToken, authorizeRoles('parent'), parentController.updateInforForm);
router.post('/updateInfo', authenticateToken, authorizeRoles('parent'), parentController.updateInfor);




module.exports = router;
