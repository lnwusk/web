const { ActivityRegistration, Activity, User } = require('../models');

class ActivityRegistrationService {
  /**
   * 用户报名活动
   */
  async registerActivity(userId, activityId, notes = null) {
    try {
      // 检查活动是否存在且状态为已发布
      const activity = await Activity.findByPk(activityId);
      if (!activity) {
        throw new Error('活动不存在');
      }
      
      if (activity.status !== 'published') {
        throw new Error('活动未发布，无法报名');
      }

      // 检查是否已经报名
      const existingRegistration = await ActivityRegistration.findOne({
        where: { userId, activityId }
      });
      
      if (existingRegistration) {
        throw new Error('您已经报名过此活动');
      }

      // 检查活动是否已满员
      if (activity.currentParticipants >= activity.maxParticipants) {
        throw new Error('活动已满员');
      }

      // 创建报名记录，直接设为已确认状态
      const registration = await ActivityRegistration.create({
        userId,
        activityId,
        status: 'confirmed',
        notes
      });

      // 更新活动的当前参与人数
      await Activity.update(
        { currentParticipants: activity.currentParticipants + 1 },
        { where: { id: activityId } }
      );

      return registration;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 取消报名
   */
  async cancelRegistration(userId, activityId) {
    try {
      const registration = await ActivityRegistration.findOne({
        where: { userId, activityId }
      });

      if (!registration) {
        throw new Error('未找到报名记录');
      }

      if (registration.status === 'cancelled') {
        throw new Error('报名已取消');
      }

      // 更新报名状态
      await registration.update({ status: 'cancelled' });

      // 更新活动的当前参与人数
      const activity = await Activity.findByPk(activityId);
      if (activity && activity.currentParticipants > 0) {
        await Activity.update(
          { currentParticipants: activity.currentParticipants - 1 },
          { where: { id: activityId } }
        );
      }

      return registration;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 获取用户的所有报名记录
   */
  async getUserRegistrations(userId, status = null, page = 1, limit = 10) {
    try {
      const whereClause = { userId };
      if (status && status !== 'all') {
        whereClause.status = status;
      }

      const offset = (page - 1) * limit;

      const registrations = await ActivityRegistration.findAll({
        where: whereClause,
        include: [
          {
            model: Activity,
            as: 'activity',
            include: [
              {
                model: User,
                as: 'organizer',
                attributes: ['id', 'username']
              }
            ]
          }
        ],
        order: [['registrationTime', 'DESC']],
        limit: parseInt(limit),
        offset: offset
      });

      return registrations;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 获取活动的所有报名记录
   */
  async getActivityRegistrations(activityId, status = null, page = 1, limit = 10) {
    try {
      const whereClause = { activityId };
      if (status && status !== 'all') {
        whereClause.status = status;
      }

      const offset = (page - 1) * limit;

      const registrations = await ActivityRegistration.findAll({
        where: whereClause,
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'username']
          }
        ],
        order: [['registrationTime', 'ASC']],
        limit: parseInt(limit),
        offset: offset
      });

      return registrations;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 检查用户是否已报名某个活动
   */
  async checkUserRegistration(userId, activityId) {
    try {
      const registration = await ActivityRegistration.findOne({
        where: { userId, activityId }
      });
      
      return registration;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 获取报名统计信息
   */
  async getRegistrationStats(activityId) {
    try {
      const stats = await ActivityRegistration.findAll({
        where: { activityId },
        attributes: [
          'status',
          [ActivityRegistration.sequelize.fn('COUNT', ActivityRegistration.sequelize.col('id')), 'count']
        ],
        group: ['status']
      });

      return stats;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ActivityRegistrationService(); 