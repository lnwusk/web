const express = require('express');
const router = express.Router();
const activityRegistrationController = require('../controllers/activityRegistrationController');
const { authenticateToken } = require('../middleware/auth');

// 所有路由都需要认证
router.use(authenticateToken);

// 用户报名活动
router.post('/register', activityRegistrationController.registerActivity);

// 取消报名
router.delete('/cancel/:activityId', activityRegistrationController.cancelRegistration);

// 获取用户的所有报名记录
router.get('/user', activityRegistrationController.getUserRegistrations);

// 检查用户是否已报名某个活动
router.get('/check/:activityId', activityRegistrationController.checkUserRegistration);

// 管理员功能 - 获取活动的所有报名记录
router.get('/activity/:activityId', activityRegistrationController.getActivityRegistrations);

// 管理员功能 - 获取报名统计信息
router.get('/stats/:activityId', activityRegistrationController.getRegistrationStats);

module.exports = router; 