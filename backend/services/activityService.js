const { Activity, User } = require('../models');

class ActivityService {
  /**
   * 创建新活动
   */
  async createActivity(activityData, organizerId) {
    try {
      console.log('活动服务 - 创建活动数据:', activityData);
      console.log('组织者ID:', organizerId);
      
      const activity = await Activity.create({
        ...activityData,
        organizerId,
        currentParticipants: 0
      });
      
      console.log('活动创建成功:', activity.toJSON());
      return activity;
    } catch (error) {
      console.error('活动服务 - 创建活动失败:', error);
      throw new Error(`创建活动失败: ${error.message}`);
    }
  }

  /**
   * 获取所有活动（分页）
   */
  async getAllActivities(page = 1, limit = 10, status = null) {
    try {
      const offset = (page - 1) * limit;
      const whereClause = status ? { status } : {};
      
      const { count, rows } = await Activity.findAndCountAll({
        where: whereClause,
        include: [{
          model: User,
          as: 'organizer',
          attributes: ['id', 'username']
        }],
        order: [['createdAt', 'DESC']],
        limit,
        offset
      });

      return {
        activities: rows,
        total: count,
        page,
        totalPages: Math.ceil(count / limit)
      };
    } catch (error) {
      throw new Error(`获取活动列表失败: ${error.message}`);
    }
  }

  /**
   * 根据ID获取活动详情
   */
  async getActivityById(id) {
    try {
      const activity = await Activity.findByPk(id, {
        include: [{
          model: User,
          as: 'organizer',
          attributes: ['id', 'username']
        }]
      });
      
      if (!activity) {
        throw new Error('活动不存在');
      }
      
      return activity;
    } catch (error) {
      throw new Error(`获取活动详情失败: ${error.message}`);
    }
  }

  /**
   * 更新活动
   */
  async updateActivity(id, updateData, organizerId) {
    try {
      const activity = await Activity.findByPk(id);
      
      if (!activity) {
        throw new Error('活动不存在');
      }
      
      if (activity.organizerId !== organizerId) {
        throw new Error('无权限修改此活动');
      }
      
      await activity.update(updateData);
      return activity;
    } catch (error) {
      throw new Error(`更新活动失败: ${error.message}`);
    }
  }

  /**
   * 删除活动
   */
  async deleteActivity(id, organizerId) {
    try {
      const activity = await Activity.findByPk(id);
      
      if (!activity) {
        throw new Error('活动不存在');
      }
      
      if (activity.organizerId !== organizerId) {
        throw new Error('无权限删除此活动');
      }
      
      await activity.destroy();
      return { message: '活动删除成功' };
    } catch (error) {
      throw new Error(`删除活动失败: ${error.message}`);
    }
  }

  /**
   * 获取用户创建的活动
   */
  async getUserActivities(organizerId, page = 1, limit = 10) {
    try {
      console.log('活动服务 - 获取用户活动，组织者ID:', organizerId);
      const offset = (page - 1) * limit;
      
      const { count, rows } = await Activity.findAndCountAll({
        where: { organizerId },
        include: [{
          model: User,
          as: 'organizer',
          attributes: ['id', 'username']
        }],
        order: [['createdAt', 'DESC']],
        limit,
        offset
      });

      console.log('活动服务 - 找到活动数量:', count);
      return {
        activities: rows,
        total: count,
        page,
        totalPages: Math.ceil(count / limit)
      };
    } catch (error) {
      console.error('活动服务 - 获取用户活动失败:', error);
      throw new Error(`获取用户活动失败: ${error.message}`);
    }
  }

  /**
   * 搜索活动
   */
  async searchActivities(searchParams, page = 1, limit = 10) {
    try {
      const offset = (page - 1) * limit;
      const whereClause = {};
      const { Op } = require('sequelize');

      // 关键词搜索（标题、描述、地点）
      if (searchParams.keyword) {
        whereClause[Op.or] = [
          { title: { [Op.like]: `%${searchParams.keyword}%` } },
          { description: { [Op.like]: `%${searchParams.keyword}%` } },
          { location: { [Op.like]: `%${searchParams.keyword}%` } }
        ];
      }

      // 状态筛选
      if (searchParams.status) {
        whereClause.status = searchParams.status;
      }

      // 时间范围筛选
      if (searchParams.startDate) {
        whereClause.startTime = { [Op.gte]: new Date(searchParams.startDate) };
      }

      if (searchParams.endDate) {
        whereClause.endTime = whereClause.endTime || {};
        whereClause.endTime[Op.lte] = new Date(searchParams.endDate);
      }

      // 价格范围筛选
      if (searchParams.minPrice !== undefined) {
        whereClause.price = whereClause.price || {};
        whereClause.price[Op.gte] = searchParams.minPrice;
      }

      if (searchParams.maxPrice !== undefined) {
        whereClause.price = whereClause.price || {};
        whereClause.price[Op.lte] = searchParams.maxPrice;
      }

      // 组织者筛选
      if (searchParams.organizerId) {
        whereClause.organizerId = searchParams.organizerId;
      }

      const { count, rows } = await Activity.findAndCountAll({
        where: whereClause,
        include: [{
          model: User,
          as: 'organizer',
          attributes: ['id', 'username']
        }],
        order: [['createdAt', 'DESC']],
        limit,
        offset
      });

      return {
        activities: rows,
        total: count,
        page,
        totalPages: Math.ceil(count / limit)
      };
    } catch (error) {
      throw new Error(`搜索活动失败: ${error.message}`);
    }
  }

  /**
   * 获取热门活动（按参与人数排序）
   */
  async getPopularActivities(limit = 10) {
    try {
      const activities = await Activity.findAll({
        where: { status: 'published' },
        include: [{
          model: User,
          as: 'organizer',
          attributes: ['id', 'username']
        }],
        order: [['currentParticipants', 'DESC']],
        limit
      });

      return activities;
    } catch (error) {
      throw new Error(`获取热门活动失败: ${error.message}`);
    }
  }

  /**
   * 获取即将开始的活动
   */
  async getUpcomingActivities(limit = 10) {
    try {
      const { Op } = require('sequelize');
      const now = new Date();

      const activities = await Activity.findAll({
        where: {
          status: 'published',
          startTime: { [Op.gt]: now }
        },
        include: [{
          model: User,
          as: 'organizer',
          attributes: ['id', 'username']
        }],
        order: [['startTime', 'ASC']],
        limit
      });

      return activities;
    } catch (error) {
      throw new Error(`获取即将开始的活动失败: ${error.message}`);
    }
  }
}

module.exports = new ActivityService(); 