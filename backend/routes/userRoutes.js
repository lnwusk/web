const express = require('express');
const UserController = require('../controllers/userController');

/**
 * 用户相关路由
 * 单一职责：只负责路由分发
 */
const router = express.Router();

// 登录
router.post('/login', UserController.login);
// 注册
router.post('/register', UserController.register);

module.exports = router; 