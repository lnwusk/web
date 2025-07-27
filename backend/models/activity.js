const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('./sequelize');

/**
 * Activity 模型，表示体育活动。
 * 字段：
 *   - title: 活动标题，必填
 *   - description: 活动描述
 *   - location: 活动地点
 *   - startTime: 开始时间
 *   - endTime: 结束时间
 *   - maxParticipants: 最大参与人数
 *   - currentParticipants: 当前参与人数
 *   - price: 活动价格
 *   - status: 活动状态 (draft, published, cancelled, completed)
 *   - organizerId: 组织者ID，关联用户
 */
class Activity extends Model {}

Activity.init({
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '活动标题',
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    comment: '活动描述',
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: '活动地点',
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: '开始时间',
    field: 'start_time'
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: '结束时间',
    field: 'end_time'
  },
  maxParticipants: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: '最大参与人数',
    field: 'max_participants'
  },
  currentParticipants: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: '当前参与人数',
    field: 'current_participants'
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
    comment: '活动价格',
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'cancelled', 'completed'),
    allowNull: false,
    defaultValue: 'draft',
    comment: '活动状态',
  },
  organizerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: '组织者ID',
    field: 'organizer_id'
  },
}, {
  sequelize,
  modelName: 'Activity',
  tableName: 'activities',
  timestamps: true,
});

module.exports = Activity; 