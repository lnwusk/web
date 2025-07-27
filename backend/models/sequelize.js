const { Sequelize } = require('sequelize');
const databaseConfig = require('../config/database');

// 创建 Sequelize 实例，关闭SQL日志
const sequelize = new Sequelize({
  ...databaseConfig,
  logging: false // 关闭SQL查询日志
});

async function testDatabaseConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ 数据库连接成功！');
    return true;
  } catch (error) {
    console.error('❌ 无法连接数据库:', error.message);
    return false;
  }
}

// 同步数据库模型
async function syncDatabase() {
  try {
    await sequelize.sync({ alter: true });
    console.log('✅ 数据库模型同步成功！');
    return true;
  } catch (error) {
    console.error('❌ 数据库模型同步失败:', error.message);
    return false;
  }
}

module.exports = {
  sequelize,
  testDatabaseConnection,
  syncDatabase
}; 