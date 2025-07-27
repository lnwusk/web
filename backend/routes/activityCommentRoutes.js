const express = require('express');
const router = express.Router();
const activityCommentController = require('../controllers/activityCommentController');
const { authenticateToken } = require('../middleware/auth');

// 获取活动的评论列表（无需认证）
router.get('/activity/:activityId', activityCommentController.getActivityComments);

// 获取评论详情（无需认证）
router.get('/:commentId', activityCommentController.getCommentById);

// 获取活动的评分统计（无需认证）
router.get('/stats/:activityId', activityCommentController.getActivityRatingStats);

// 以下路由需要认证
router.use(authenticateToken);

// 添加评论
router.post('/add', activityCommentController.addComment);

// 更新评论
router.put('/:commentId', activityCommentController.updateComment);

// 删除评论
router.delete('/:commentId', activityCommentController.deleteComment);

// 获取用户的所有评论
router.get('/user/comments', activityCommentController.getUserComments);

module.exports = router; 