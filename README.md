# 体育活动室管理系统

一个基于React + Node.js的全栈体育活动管理系统，支持多用户注册、活动管理、报名、评论等功能。

## 功能特性

### 已实现功能
- ✅ 多用户注册、登录
- ✅ 活动管理（创建、编辑、删除、状态管理）
- ✅ 活动列表查看
- ✅ 活动详情查看
- ✅ 活动报名管理
- ✅ 活动订单管理（我的报名）
- ✅ 活动评论系统
- ✅ 活动搜索功能

### 新增功能说明

#### 1. 活动报名管理
- 用户可以在活动详情页面报名参加活动
- 支持添加备注信息
- 自动检查活动是否已满员
- 防止重复报名

#### 2. 活动订单管理（我的报名）
- 查看用户的所有报名记录
- 按状态筛选（全部、待确认、已确认、已取消）
- 支持取消报名
- 显示报名详情和状态

#### 3. 活动评论系统
- 支持发表评论和评分（1-5星）
- 支持回复评论
- 评论分页显示
- 显示评分统计
- 用户只能删除自己的评论

#### 4. 活动搜索功能
- 关键词搜索（标题、描述、地点）
- 状态筛选
- 时间范围筛选
- 价格范围筛选
- 热门活动推荐
- 即将开始的活动推荐

## 技术栈

### 后端
- Node.js + Express.js
- Sequelize ORM
- MySQL 数据库
- JWT 认证

### 前端
- React 18
- Vite 构建工具
- CSS3 + Flexbox/Grid
- 响应式设计

## 项目结构

```
web/
├── backend/                 # 后端代码
│   ├── config/             # 配置文件
│   ├── controllers/        # 控制器
│   ├── models/            # 数据模型
│   ├── routes/            # 路由
│   ├── services/          # 业务逻辑
│   └── middleware/        # 中间件
└── frontend/              # 前端代码
    ├── src/
    │   ├── components/    # 组件
    │   ├── pages/         # 页面
    │   └── styles/        # 样式文件
    └── public/            # 静态资源
```

## 数据库设计

### 主要数据表
1. **users** - 用户表
2. **activities** - 活动表
3. **activity_registrations** - 活动报名表
4. **activity_comments** - 活动评论表

### 关联关系
- 用户与活动：一对多（组织者）
- 用户与报名：一对多
- 活动与报名：一对多
- 用户与评论：一对多
- 活动与评论：一对多
- 评论与回复：自关联

## API 接口

### 活动相关
- `GET /api/activities` - 获取活动列表
- `GET /api/activities/search` - 搜索活动
- `GET /api/activities/popular` - 获取热门活动
- `GET /api/activities/upcoming` - 获取即将开始的活动
- `GET /api/activities/:id` - 获取活动详情
- `POST /api/activities` - 创建活动
- `PUT /api/activities/:id` - 更新活动
- `DELETE /api/activities/:id` - 删除活动

### 报名相关
- `POST /api/registrations/register` - 报名活动
- `DELETE /api/registrations/cancel/:activityId` - 取消报名
- `GET /api/registrations/user` - 获取用户报名记录
- `GET /api/registrations/check/:activityId` - 检查报名状态

### 评论相关
- `POST /api/comments/add` - 添加评论
- `GET /api/comments/activity/:activityId` - 获取活动评论
- `PUT /api/comments/:commentId` - 更新评论
- `DELETE /api/comments/:commentId` - 删除评论
- `GET /api/comments/stats/:activityId` - 获取评分统计

## 安装和运行

### 后端
```bash
cd backend
npm install
npm start
```

### 前端
```bash
cd frontend
npm install
npm run dev
```

## 环境配置

创建 `.env` 文件配置数据库连接：

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=sports_activity
DB_USER=your_username
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
```

## 使用说明

1. **注册登录**：新用户需要先注册账号
2. **浏览活动**：在首页查看所有已发布的活动
3. **搜索活动**：使用搜索功能查找特定活动
4. **报名活动**：在活动详情页面点击报名按钮
5. **管理报名**：在"我的报名"页面查看和管理报名记录
6. **发表评论**：在活动详情页面底部发表评论和评分
7. **创建活动**：在"活动管理"页面创建和管理自己的活动

## 注意事项

- 活动报名需要登录
- 只能取消待确认状态的报名
- 评论支持回复功能
- 搜索功能支持多种筛选条件
- 系统会自动检查活动满员状态

## 开发计划

- [ ] 活动图片上传
- [ ] 活动分类管理
- [ ] 用户个人资料
- [ ] 活动通知系统
- [ ] 管理员后台
- [ ] 数据统计报表 