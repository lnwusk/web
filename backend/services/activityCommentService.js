const { ActivityComment, User, Activity } = require('../models');

class ActivityCommentService {
  /**
   * 添加评论
   */
  async addComment(userId, activityId, content, rating = null, parentId = null) {
    try {
      // 检查活动是否存在
      const activity = await Activity.findByPk(activityId);
      if (!activity) {
        throw new Error('活动不存在');
      }

      // 如果是回复评论，检查父评论是否存在
      if (parentId) {
        const parentComment = await ActivityComment.findByPk(parentId);
        if (!parentComment) {
          throw new Error('回复的评论不存在');
        }
        if (parentComment.activityId !== parseInt(activityId)) {
          throw new Error('回复的评论不属于此活动');
        }
      }

      // 验证评分范围
      if (rating && (rating < 1 || rating > 5)) {
        throw new Error('评分必须在1-5之间');
      }

      const comment = await ActivityComment.create({
        userId,
        activityId,
        content,
        rating,
        parentId
      });

      return comment;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 获取活动的评论列表
   */
  async getActivityComments(activityId, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      
      const comments = await ActivityComment.findAndCountAll({
        where: { 
          activityId,
          parentId: null // 只获取顶级评论
        },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'username']
          },
          {
            model: ActivityComment,
            as: 'replies',
            include: [
              {
                model: User,
                as: 'user',
                attributes: ['id', 'username']
              }
            ],
            order: [['createdAt', 'ASC']]
          }
        ],
        order: [['createdAt', 'DESC']],
        limit,
        offset
      });

      return {
        comments: comments.rows,
        total: comments.count,
        page,
        limit,
        totalPages: Math.ceil(comments.count / limit)
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * 获取评论详情
   */
  async getCommentById(commentId) {
    try {
      const comment = await ActivityComment.findByPk(commentId, {
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'username']
          },
          {
            model: ActivityComment,
            as: 'replies',
            include: [
              {
                model: User,
                as: 'user',
                attributes: ['id', 'username']
              }
            ]
          }
        ]
      });

      if (!comment) {
        throw new Error('评论不存在');
      }

      return comment;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 更新评论
   */
  async updateComment(commentId, userId, content, rating = null) {
    try {
      const comment = await ActivityComment.findByPk(commentId);
      
      if (!comment) {
        throw new Error('评论不存在');
      }

      // 检查是否是评论的作者
      if (comment.userId !== userId) {
        throw new Error('只能修改自己的评论');
      }

      // 验证评分范围
      if (rating && (rating < 1 || rating > 5)) {
        throw new Error('评分必须在1-5之间');
      }

      await comment.update({ content, rating });
      return comment;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 删除评论
   */
  async deleteComment(commentId, userId) {
    try {
      const comment = await ActivityComment.findByPk(commentId);
      
      if (!comment) {
        throw new Error('评论不存在');
      }

      // 检查是否是评论的作者
      if (comment.userId !== userId) {
        throw new Error('只能删除自己的评论');
      }

      // 删除评论及其回复
      await ActivityComment.destroy({
        where: {
          [ActivityComment.sequelize.Op.or]: [
            { id: commentId },
            { parentId: commentId }
          ]
        }
      });

      return { message: '评论删除成功' };
    } catch (error) {
      throw error;
    }
  }

  /**
   * 获取活动的评分统计
   */
  async getActivityRatingStats(activityId) {
    try {
      const stats = await ActivityComment.findAll({
        where: { 
          activityId,
          rating: {
            [ActivityComment.sequelize.Op.not]: null
          }
        },
        attributes: [
          [ActivityComment.sequelize.fn('AVG', ActivityComment.sequelize.col('rating')), 'averageRating'],
          [ActivityComment.sequelize.fn('COUNT', ActivityComment.sequelize.col('id')), 'totalRatings']
        ]
      });

      return {
        averageRating: parseFloat(stats[0]?.dataValues?.averageRating || 0).toFixed(1),
        totalRatings: parseInt(stats[0]?.dataValues?.totalRatings || 0)
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * 获取用户的所有评论
   */
  async getUserComments(userId, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      
      const comments = await ActivityComment.findAndCountAll({
        where: { userId },
        include: [
          {
            model: Activity,
            as: 'activity',
            attributes: ['id', 'title']
          }
        ],
        order: [['createdAt', 'DESC']],
        limit,
        offset
      });

      return {
        comments: comments.rows,
        total: comments.count,
        page,
        limit,
        totalPages: Math.ceil(comments.count / limit)
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ActivityCommentService(); 