const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('./sequelize');

/**
 * ActivityComment 模型，表示活动评论。
 * 字段：
 *   - userId: 用户ID，关联用户
 *   - activityId: 活动ID，关联活动
 *   - content: 评论内容
 *   - rating: 评分 (1-5星)
 *   - parentId: 父评论ID，用于回复功能
 */
class ActivityComment extends Model {}

ActivityComment.init({
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
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    comment: '评论内容',
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 1,
      max: 5
    },
    comment: '评分 (1-5星)',
  },
  parentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: '父评论ID，用于回复功能',
    field: 'parent_id'
  },
}, {
  sequelize,
  modelName: 'ActivityComment',
  tableName: 'activity_comments',
  timestamps: true,
});

module.exports = ActivityComment; 