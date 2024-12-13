const express = require('express');
const router = express.Router();
const authController = require('../app/controllers/AuthController');
const { authenticateToken, authorizeRoles } = require('../app/middleware/authmiddleware');


router.get('/', authController.home);
//router.get('/login', authController.loginForm);
router.post('/login', authController.login);
//router.get('/register', authController.registerForm);
router.post('/register', authController.register);

// Route GET để hiển thị form thay đổi mật khẩu
//router.get('/updatepassword', authenticateToken,  authController.updatePasswordForm);

// Route POST để xử lý yêu cầu thay đổi mật khẩu
router.post('/updatepassword', authenticateToken,  authController.updatePassword);

// Route để gửi yêu cầu quên mật khẩu
router.post('/forgot-password',authenticateToken, authController.forgotPassword);
// Route để đặt lại mật khẩu dựa trên mã xác thực
router.post('/reset-password',authenticateToken, authController.resetPassword);


module.exports = router;