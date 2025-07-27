# 体育活动室

一个基于React和Node.js的体育活动管理平台，支持用户注册、活动管理、报名和评论功能。

## 🚀 功能特性

- **用户管理**：注册、登录、认证
- **活动管理**：创建、编辑、删除活动
- **活动报名**：用户报名、取消报名
- **活动搜索**：按名称搜索活动
- **活动评论**：评论和评分系统
- **响应式设计**：支持移动端和桌面端

## 🛠️ 技术栈

### 前端
- **React 18** - 用户界面框架
- **Vite** - 构建工具
- **React Router** - 路由管理
- **Axios** - HTTP客户端
- **CSS3** - 样式设计

### 后端
- **Node.js** - 运行环境
- **Express.js** - Web框架
- **Sequelize** - ORM数据库操作
- **MySQL** - 数据库
- **JWT** - 身份认证
- **bcrypt** - 密码加密

## 📁 项目结构

```
web/
├── frontend/                 # 前端React应用
│   ├── src/
│   │   ├── components/      # 可复用组件
│   │   ├── pages/          # 页面组件
│   │   ├── api/            # API接口
│   │   └── styles/         # 样式文件
│   ├── package.json
│   └── vite.config.js
├── backend/                 # 后端Node.js API
│   ├── controllers/        # 控制器
│   ├── models/            # 数据模型
│   ├── routes/            # 路由
│   ├── services/          # 业务逻辑
│   ├── middleware/        # 中间件
│   └── package.json
├── .github/               # GitHub Actions配置
└── README.md
```

## 🗄️ 数据库设计

### 主要表结构
- **users** - 用户信息
- **activities** - 活动信息
- **activity_registrations** - 活动报名记录
- **activity_comments** - 活动评论

## 🔌 API接口

### 用户相关
- `POST /api/register` - 用户注册
- `POST /api/login` - 用户登录

### 活动相关
- `GET /api/activities` - 获取活动列表
- `POST /api/activities` - 创建活动
- `GET /api/activities/:id` - 获取活动详情
- `PUT /api/activities/:id` - 更新活动
- `DELETE /api/activities/:id` - 删除活动

### 报名相关
- `POST /api/registrations/register` - 报名活动
- `DELETE /api/registrations/cancel/:activityId` - 取消报名
- `GET /api/registrations/user` - 获取用户报名记录

### 评论相关
- `POST /api/comments/add` - 添加评论
- `GET /api/comments/activity/:activityId` - 获取活动评论

## 🚀 快速开始

### 环境要求
- Node.js 18+
- MySQL 8.0+
- npm 或 yarn

### 安装步骤

1. **克隆项目**
   ```bash
   git clone https://github.com/lnwusk/web.git
   cd web
   ```

2. **配置数据库**
   ```bash
   # 创建MySQL数据库
   CREATE DATABASE sports_room;
   ```

3. **配置环境变量**
   ```bash
   # 后端环境变量 (.env)
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=sports_room
   DB_USER=root
   DB_PASSWORD=your_password
   JWT_SECRET=your_jwt_secret
   ```

4. **安装依赖**
   ```bash
   # 安装后端依赖
   cd backend
   npm install

   # 安装前端依赖
   cd ../frontend
   npm install
   ```

5. **启动服务**
   ```bash
   # 启动后端服务
   cd backend
   npm run dev

   # 启动前端服务
   cd frontend
   npm run dev
   ```

6. **访问应用**
   - 前端：http://localhost:5173
   - 后端：http://localhost:5000

## 🔄 CI/CD

项目配置了GitHub Actions持续集成：

- **自动测试**：代码推送时自动运行测试
- **自动构建**：验证前端构建是否成功
- **代码质量**：确保代码符合规范

详细配置请查看 [CI_CD_SETUP.md](./CI_CD_SETUP.md)

## 📝 使用说明

### 用户功能
1. **注册/登录**：创建账户或登录现有账户
2. **浏览活动**：查看所有可报名的活动
3. **报名活动**：点击活动详情页面的报名按钮
4. **管理报名**：在"我的报名"页面查看和管理报名记录
5. **搜索活动**：使用搜索功能查找特定活动
6. **评论活动**：在活动详情页面添加评论和评分

### 管理员功能
1. **创建活动**：在"活动管理"页面创建新活动
2. **编辑活动**：修改活动信息
3. **删除活动**：移除不需要的活动
4. **查看报名**：查看活动的报名情况

## 🛡️ 安全特性

- JWT身份认证
- 密码加密存储
- 输入验证和清理
- SQL注入防护
- XSS防护

## 🔧 开发指南

### 代码规范
- 使用ESLint进行代码检查
- 遵循React最佳实践
- 保持代码注释完整

### 测试
```bash
# 前端测试
cd frontend
npm test

# 后端测试
cd backend
npm test
```

### 构建
```bash
# 前端构建
cd frontend
npm run build

# 后端启动
cd backend
npm start
```

## 🤝 贡献指南

1. Fork项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建Pull Request

## 📄 许可证

本项目采用 ISC 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系方式

- 项目链接：[https://github.com/lnwusk/web](https://github.com/lnwusk/web)
- 问题反馈：[Issues](https://github.com/lnwusk/web/issues)

## 🙏 致谢

感谢所有为这个项目做出贡献的开发者！ 