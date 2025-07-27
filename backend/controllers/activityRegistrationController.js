const activityRegistrationService = require('../services/activityRegistrationService');

class ActivityRegistrationController {
  /**
   * 用户报名活动
   */
  async registerActivity(req, res) {
    try {
      const { activityId, notes } = req.body;
      const userId = req.user.id;

      if (!activityId) {
        return res.status(400).json({ error: '活动ID不能为空' });
      }

      const registration = await activityRegistrationService.registerActivity(
        userId,
        activityId,
        notes
      );

      res.status(201).json({
        message: '报名成功',
        data: registration
      });
    } catch (error) {
      console.error('报名活动失败:', error);
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * 取消报名
   */
  async cancelRegistration(req, res) {
    try {
      const { activityId } = req.params;
      const userId = req.user.id;

      const registration = await activityRegistrationService.cancelRegistration(
        userId,
        activityId
      );

      res.json({
        message: '取消报名成功',
        data: registration
      });
    } catch (error) {
      console.error('取消报名失败:', error);
      res.status(400).json({ error: error.message });
    }
  }

  /**
   * 获取用户的所有报名记录
   */
  async getUserRegistrations(req, res) {
    try {
      const userId = req.user.id;
      const { status, page = 1, limit = 10 } = req.query;

      console.log('获取用户报名记录 - 用户ID:', userId, '状态:', status, '页码:', page, '限制:', limit);

      const registrations = await activityRegistrationService.getUserRegistrations(
        userId,
        status,
        parseInt(page),
        parseInt(limit)
      );

      console.log('查询到的报名记录数量:', registrations.length);

      res.json({
        message: '获取报名记录成功',
        data: registrations
      });
    } catch (error) {
      console.error('获取用户报名记录失败:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * 获取活动的所有报名记录（管理员功能）
   */
  async getActivityRegistrations(req, res) {
    try {
      const { activityId } = req.params;
      const { status, page = 1, limit = 10 } = req.query;

      const registrations = await activityRegistrationService.getActivityRegistrations(
        activityId,
        status,
        parseInt(page),
        parseInt(limit)
      );

      res.json({
        message: '获取活动报名记录成功',
        data: registrations
      });
    } catch (error) {
      console.error('获取活动报名记录失败:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * 检查用户是否已报名某个活动
   */
  async checkUserRegistration(req, res) {
    try {
      const { activityId } = req.params;
      const userId = req.user.id;

      const registration = await activityRegistrationService.checkUserRegistration(
        userId,
        activityId
      );

      res.json({
        message: '检查报名状态成功',
        data: {
          isRegistered: !!registration,
          registration: registration
        }
      });
    } catch (error) {
      console.error('检查报名状态失败:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * 获取报名统计信息（管理员功能）
   */
  async getRegistrationStats(req, res) {
    try {
      const { activityId } = req.params;

      const stats = await activityRegistrationService.getRegistrationStats(activityId);

      res.json({
        message: '获取报名统计成功',
        data: stats
      });
    } catch (error) {
      console.error('获取报名统计失败:', error);
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ActivityRegistrationController(); 