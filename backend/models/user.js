const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('./sequelize');

/**
 * User 模型，表示系统中的用户。
 * 字段：
 *   - username: 用户名，唯一且必填
 *   - password: 密码哈希，必填
 */
class User extends Model {}

User.init({
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    comment: '用户名，唯一',
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '密码哈希',
  },
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  timestamps: true,
});

module.exports = User; 