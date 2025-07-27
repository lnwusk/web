const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');

// 创建活动
router.post('/', activityController.createActivity);

// 获取所有活动
router.get('/', activityController.getAllActivities);

// 搜索活动
router.get('/search', activityController.searchActivities);

// 获取热门活动
router.get('/popular', activityController.getPopularActivities);

// 获取即将开始的活动
router.get('/upcoming', activityController.getUpcomingActivities);

// 获取用户创建的活动 - 必须放在 /:id 之前
router.get('/user/my', activityController.getUserActivities);

// 获取活动详情
router.get('/:id', activityController.getActivityById);

// 更新活动
router.put('/:id', activityController.updateActivity);

// 删除活动
router.delete('/:id', activityController.deleteActivity);

module.exports = router; 