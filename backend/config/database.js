require('dotenv').config();

module.exports = {
  dialect: 'mysql',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  define: {
    timestamps: true,  // 自动添加 createdAt 和 updatedAt 字段
    underscored: true, // 使用下划线命名风格
    freezeTableName: true, // 禁止复数表名
  },
  dialectOptions: {
    decimalNumbers: true, // 正确处理DECIMAL类型
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};