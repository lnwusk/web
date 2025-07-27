const activityService = require('../services/activityService');
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

class ActivityController {
  /**
   * 创建活动
   */
  async createActivity(req, res) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: '未提供认证令牌' });
      }

      const decoded = jwt.verify(token, SECRET);
      const organizerId = decoded.id;

      // 验证必填字段
      const { title, startTime, endTime } = req.body;
      if (!title) {
        return res.status(400).json({ message: '活动标题不能为空' });
      }
      if (!startTime) {
        return res.status(400).json({ message: '开始时间不能为空' });
      }
      if (!endTime) {
        return res.status(400).json({ message: '结束时间不能为空' });
      }

      const activityData = {
        title: req.body.title,
        description: req.body.description || '',
        location: req.body.location || '',
        startTime: new Date(req.body.startTime),
        endTime: new Date(req.body.endTime),
        maxParticipants: parseInt(req.body.maxParticipants) || 0,
        price: parseFloat(req.body.price) || 0.00,
        status: req.body.status || 'draft'
      };

      console.log('创建活动数据:', activityData);
      const activity = await activityService.createActivity(activityData, organizerId);
      res.status(201).json({
        message: '活动创建成功',
        activity
      });
    } catch (error) {
      console.error('创建活动错误:', error);
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * 获取所有活动
   */
  async getAllActivities(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const status = req.query.status;

      const result = await activityService.getAllActivities(page, limit, status);
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * 获取活动详情
   */
  async getActivityById(req, res) {
    try {
      const { id } = req.params;
      const activity = await activityService.getActivityById(id);
      res.json(activity);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  }

  /**
   * 更新活动
   */
  async updateActivity(req, res) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: '未提供认证令牌' });
      }

      const decoded = jwt.verify(token, SECRET);
      const organizerId = decoded.id;

      const { id } = req.params;
      const updateData = req.body;

      const activity = await activityService.updateActivity(id, updateData, organizerId);
      res.json({
        message: '活动更新成功',
        activity
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * 删除活动
   */
  async deleteActivity(req, res) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: '未提供认证令牌' });
      }

      const decoded = jwt.verify(token, SECRET);
      const organizerId = decoded.id;

      const { id } = req.params;
      const result = await activityService.deleteActivity(id, organizerId);
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * 获取用户创建的活动
   */
  async getUserActivities(req, res) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ message: '未提供认证令牌' });
      }

      const decoded = jwt.verify(token, SECRET);
      const organizerId = decoded.id;

      console.log('控制器 - 获取用户活动，组织者ID:', organizerId);

      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const result = await activityService.getUserActivities(organizerId, page, limit);
      console.log('控制器 - 返回结果:', result);
      res.json(result);
    } catch (error) {
      console.error('控制器 - 获取用户活动错误:', error);
      res.status(400).json({ message: error.message });
    }
  }

  /**
   * 搜索活动
   */
  async searchActivities(req, res) {
    try {
      const searchParams = req.query;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const result = await activityService.searchActivities(searchParams, page, limit);
      res.json({
        message: '搜索活动成功',
        data: result
      });
    } catch (error) {
      console.error('搜索活动失败:', error);
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * 获取热门活动
   */
  async getPopularActivities(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const activities = await activityService.getPopularActivities(limit);
      
      res.json({
        message: '获取热门活动成功',
        data: activities
      });
    } catch (error) {
      console.error('获取热门活动失败:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * 获取即将开始的活动
   */
  async getUpcomingActivities(req, res) {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const activities = await activityService.getUpcomingActivities(limit);
      
      res.json({
        message: '获取即将开始的活动成功',
        data: activities
      });
    } catch (error) {
      console.error('获取即将开始的活动失败:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ActivityController(); 