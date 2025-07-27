const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('./sequelize');

/**
 * ActivityRegistration 模型，表示活动报名/订单。
 * 字段：
 *   - userId: 用户ID，关联用户
 *   - activityId: 活动ID，关联活动
 *   - status: 报名状态 (confirmed, cancelled)
 *   - registrationTime: 报名时间
 *   - notes: 备注信息
 */
class ActivityRegistration extends Model {}

ActivityRegistration.init({
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '用户ID',
    field: 'user_id'
  },
  activityId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '活动ID',
    field: 'activity_id'
  },
  status: {
    type: DataTypes.ENUM('confirmed', 'cancelled'),
    allowNull: false,
    defaultValue: 'confirmed',
    comment: '报名状态',
  },
  registrationTime: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    comment: '报名时间',
    field: 'registration_time'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '备注信息',
  },
}, {
  sequelize,
  modelName: 'ActivityRegistration',
  tableName: 'activity_registrations',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'activity_id'],
      name: 'unique_user_activity'
    }
  ]
});

module.exports = ActivityRegistration; 