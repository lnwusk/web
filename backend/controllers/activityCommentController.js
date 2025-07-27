const activityCommentService = require('../services/activityCommentService');

class ActivityCommentController {
  /**
   * 添加评论
   */
  async addComment(req, res) {
    try {
      const { activityId, content, rating, parentId } = req.body;
      const userId = req.user.id;

      if (!activityId || !content) {
        return res.status(400).json({ error: '活动ID和评论内容不能为空' });
      }

      const comment = await activityCommentService.addComment(
        userId,
        activityId,
        content,
        rating,
        parentId
      );

      res.status(201).json({
        message: '评论添加成功',
        data: comment
      });
    } catch (error) {
      console.error('添加评论失败:', error);
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * 获取活动的评论列表
   */
  async getActivityComments(req, res) {
    try {
      const { activityId } = req.params;
      const { page = 1, limit = 10 } = req.query;

      const comments = await activityCommentService.getActivityComments(
        activityId,
        parseInt(page),
        parseInt(limit)
      );

      res.json({
        message: '获取评论列表成功',
        data: comments
      });
    } catch (error) {
      console.error('获取评论列表失败:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * 获取评论详情
   */
  async getCommentById(req, res) {
    try {
      const { commentId } = req.params;

      const comment = await activityCommentService.getCommentById(commentId);

      res.json({
        message: '获取评论详情成功',
        data: comment
      });
    } catch (error) {
      console.error('获取评论详情失败:', error);
      res.status(404).json({ error: error.message });
    }
  }

  /**
   * 更新评论
   */
  async updateComment(req, res) {
    try {
      const { commentId } = req.params;
      const { content, rating } = req.body;
      const userId = req.user.id;

      if (!content) {
        return res.status(400).json({ error: '评论内容不能为空' });
      }

      const comment = await activityCommentService.updateComment(
        commentId,
        userId,
        content,
        rating
      );

      res.json({
        message: '评论更新成功',
        data: comment
      });
    } catch (error) {
      console.error('更新评论失败:', error);
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * 删除评论
   */
  async deleteComment(req, res) {
    try {
      const { commentId } = req.params;
      const userId = req.user.id;

      const result = await activityCommentService.deleteComment(commentId, userId);

      res.json({
        message: '评论删除成功',
        data: result
      });
    } catch (error) {
      console.error('删除评论失败:', error);
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * 获取活动的评分统计
   */
  async getActivityRatingStats(req, res) {
    try {
      const { activityId } = req.params;

      const stats = await activityCommentService.getActivityRatingStats(activityId);

      res.json({
        message: '获取评分统计成功',
        data: stats
      });
    } catch (error) {
      console.error('获取评分统计失败:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * 获取用户的所有评论
   */
  async getUserComments(req, res) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10 } = req.query;

      const comments = await activityCommentService.getUserComments(
        userId,
        parseInt(page),
        parseInt(limit)
      );

      res.json({
        message: '获取用户评论成功',
        data: comments
      });
    } catch (error) {
      console.error('获取用户评论失败:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ActivityCommentController(); 