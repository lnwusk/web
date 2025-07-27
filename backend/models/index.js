// 导入共享的sequelize实例
const { sequelize, testDatabaseConnection, syncDatabase } = require('./sequelize');

// 导入模型
const User = require('./user');
const Activity = require('./activity');
const ActivityRegistration = require('./activityRegistration');
const ActivityComment = require('./activityComment');

// 定义模型关联关系
// 用户与活动的关系 (一个用户可以创建多个活动)
User.hasMany(Activity, { foreignKey: 'organizerId', as: 'organizedActivities' });
Activity.belongsTo(User, { foreignKey: 'organizerId', as: 'organizer' });

// 用户与活动报名的关系 (一个用户可以报名多个活动)
User.hasMany(ActivityRegistration, { foreignKey: 'userId', as: 'registrations' });
ActivityRegistration.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// 活动与活动报名的关系 (一个活动可以有多个报名)
Activity.hasMany(ActivityRegistration, { foreignKey: 'activityId', as: 'registrations' });
ActivityRegistration.belongsTo(Activity, { foreignKey: 'activityId', as: 'activity' });

// 用户与评论的关系 (一个用户可以发表多个评论)
User.hasMany(ActivityComment, { foreignKey: 'userId', as: 'comments' });
ActivityComment.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// 活动与评论的关系 (一个活动可以有多个评论)
Activity.hasMany(ActivityComment, { foreignKey: 'activityId', as: 'comments' });
ActivityComment.belongsTo(Activity, { foreignKey: 'activityId', as: 'activity' });

// 评论的回复关系 (自关联)
ActivityComment.hasMany(ActivityComment, { foreignKey: 'parentId', as: 'replies' });
ActivityComment.belongsTo(ActivityComment, { foreignKey: 'parentId', as: 'parent' });

// 导出对象
module.exports = {
  sequelize,
  testDatabaseConnection,
  syncDatabase,
  User,
  Activity,
  ActivityRegistration,
  ActivityComment
};