# GitHub Actions CI/CD 设置指南

## 📋 概述

本项目已配置完整的GitHub Actions持续集成/持续部署流程，包括代码质量检查、自动化测试、安全扫描和自动部署。

## 🚀 工作流程

### 1. CI/CD Pipeline (`.github/workflows/ci.yml`)

**触发条件：**
- 推送到 `main` 或 `develop` 分支
- 创建 Pull Request 到 `main` 或 `develop` 分支

**执行步骤：**
1. **代码质量检查 (Lint)**
   - 前端 ESLint 检查
   - 后端 ESLint 检查
   - 代码格式检查

2. **前端测试和构建**
   - 安装依赖
   - 运行测试
   - 构建生产版本
   - 上传构建产物

3. **后端测试**
   - 启动 MySQL 测试数据库
   - 安装依赖
   - 运行单元测试
   - 集成测试

4. **集成测试**
   - 前后端联合测试
   - API 接口测试

5. **安全扫描**
   - npm audit 安全漏洞检查
   - CodeQL 代码安全分析

6. **部署准备**
   - 打包部署文件
   - 上传部署产物

### 2. 代码质量检查 (`.github/workflows/code-quality.yml`)

**功能：**
- 代码风格检查
- 格式化检查
- 测试覆盖率检查
- 上传覆盖率报告到 Codecov

### 3. 自动部署 (`.github/workflows/deploy.yml`)

**触发条件：**
- 推送到 `main` 分支
- CI/CD Pipeline 成功完成

**部署目标：**
- 前端：Vercel
- 后端：Railway

## 🛠️ 本地开发设置

### 安装依赖

```bash
# 前端
cd frontend
npm install

# 后端
cd backend
npm install
```

### 运行测试

```bash
# 前端测试
cd frontend
npm test
npm run test:coverage

# 后端测试
cd backend
npm test
npm run test:coverage
```

### 代码质量检查

```bash
# 前端
cd frontend
npm run lint
npm run lint:fix
npm run check-format
npm run format

# 后端
cd backend
npm run lint
npm run lint:fix
npm run check-format
npm run format
```

## 🔧 配置说明

### 环境变量

在 GitHub 仓库设置中添加以下 Secrets：

**Vercel 部署：**
- `VERCEL_TOKEN`: Vercel API Token
- `VERCEL_ORG_ID`: Vercel 组织 ID
- `VERCEL_PROJECT_ID`: Vercel 项目 ID

**Railway 部署：**
- `RAILWAY_TOKEN`: Railway API Token
- `RAILWAY_SERVICE`: Railway 服务名称

### 数据库配置

CI 环境使用 MySQL 8.0 测试数据库：
- 主机：localhost
- 端口：3306
- 数据库：sports_room_test
- 用户：root
- 密码：test123456

## 📊 监控和报告

### 测试覆盖率

- 前端：Vitest + @vitest/coverage-v8
- 后端：Jest
- 报告平台：Codecov

### 代码质量

- ESLint：代码规范检查
- Prettier：代码格式化
- CodeQL：安全漏洞扫描

## 🔄 自动化更新

### Dependabot

配置了自动依赖更新：
- 每周一上午 9:00 检查更新
- 前端和后端分别管理
- 自动创建 Pull Request

### 工作流更新

- GitHub Actions 自动更新
- 安全补丁自动应用

## 🚨 故障排除

### 常见问题

1. **测试失败**
   - 检查数据库连接
   - 验证环境变量
   - 查看测试日志

2. **构建失败**
   - 检查依赖版本兼容性
   - 验证 Node.js 版本
   - 查看构建日志

3. **部署失败**
   - 检查部署凭据
   - 验证目标平台配置
   - 查看部署日志

### 调试步骤

1. 查看 GitHub Actions 日志
2. 检查本地测试是否通过
3. 验证环境变量配置
4. 确认依赖版本兼容性

## 📈 最佳实践

1. **提交前检查**
   ```bash
   # 运行所有检查
   npm run lint && npm run test && npm run build
   ```

2. **分支策略**
   - `main`: 生产环境
   - `develop`: 开发环境
   - 功能分支：`feature/功能名称`

3. **提交信息规范**
   - `feat:` 新功能
   - `fix:` 修复
   - `docs:` 文档
   - `style:` 格式
   - `refactor:` 重构
   - `test:` 测试
   - `chore:` 构建

4. **代码审查**
   - 所有 PR 需要代码审查
   - 测试覆盖率要求 > 80%
   - 代码质量检查必须通过

## 🔗 相关链接

- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Vercel 部署文档](https://vercel.com/docs)
- [Railway 部署文档](https://docs.railway.app)
- [Codecov 文档](https://docs.codecov.io) 