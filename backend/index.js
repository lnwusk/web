// 添加在文件最顶部
process.on('uncaughtException', (err) => {
    console.error('未捕获的异常:', err);
    process.exit(1);
  });
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { testDatabaseConnection, syncDatabase } = require('./models');
const userRoutes = require('./routes/userRoutes');
const activityRoutes = require('./routes/activityRoutes');
const activityRegistrationRoutes = require('./routes/activityRegistrationRoutes');
const activityCommentRoutes = require('./routes/activityCommentRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// 使用 CORS 中间件允许跨域请求
app.use(cors());

// 使用 JSON 解析中间件
app.use(express.json());

// 测试数据库连接的中间件
app.use(async (req, res, next) => {
  try {
    const isConnected = await testDatabaseConnection();
    req.dbConnected = isConnected;
    next();
  } catch (error) {
    console.error('数据库连接测试失败:', error);
    req.dbConnected = false;
    next();
  }
});

// 根路由
app.get('/', (req, res) => {
  const message = req.dbConnected 
    ? '后端服务正常运行，已成功连接数据库' 
    : '后端服务正常运行，但数据库连接失败';
  res.json({ message, dbConnected: req.dbConnected });
});

// 挂载用户路由
app.use('/api', userRoutes);

// 挂载活动路由
app.use('/api/activities', activityRoutes);

// 挂载活动报名路由
app.use('/api/registrations', activityRegistrationRoutes);

// 挂载活动评论路由
app.use('/api/comments', activityCommentRoutes);

// 启动服务器前同步数据库
syncDatabase()
  .then(() => {
    // 启动服务器
    app.listen(PORT, () => {
      console.log(`🚀 服务器运行于端口 ${PORT}`);
      console.log(`🔗 访问地址: http://localhost:${PORT}`);
    });
  })
  .catch(error => {
    console.error('❌ 数据库同步失败:', error);
    console.log('❌ 服务器启动中止，请检查数据库配置');
  });