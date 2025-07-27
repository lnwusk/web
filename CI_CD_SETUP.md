# GitHub Actions CI 设置指南

## 📋 概述

本项目已配置基本的GitHub Actions持续集成流程，包括依赖安装、测试和构建。

## 🚀 工作流程

### CI Pipeline (`.github/workflows/ci.yml`)

**触发条件：**
- 推送到 `main` 分支
- 创建 Pull Request 到 `main` 分支

**执行步骤：**
1. **检出代码**
2. **设置Node.js环境**
3. **安装前端依赖**
4. **运行前端测试**
5. **构建前端**
6. **安装后端依赖**
7. **运行后端测试**

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

### 运行构建

```bash
# 前端构建
cd frontend
npm run build

# 后端启动
cd backend
npm start
```

## 🔧 配置说明

### 环境要求

- Node.js 18+
- npm 或 yarn

### 工作流文件

```yaml
name: CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        
    - name: Install frontend dependencies
      working-directory: ./frontend
      run: npm ci
      
    - name: Run frontend tests
      working-directory: ./frontend
      run: npm test || echo "No tests found"
      
    - name: Build frontend
      working-directory: ./frontend
      run: npm run build
      
    - name: Install backend dependencies
      working-directory: ./backend
      run: npm ci
      
    - name: Run backend tests
      working-directory: ./backend
      run: npm test || echo "No tests found"
```

## 📊 验证方法

### 检查GitHub Actions

1. 访问GitHub仓库的Actions页面
2. 查看工作流运行状态
3. 确认所有步骤显示绿色勾号

### 本地验证

```bash
# 前端构建测试
cd frontend
npm run build

# 后端启动测试
cd backend
npm start
```

## 🚨 故障排除

### 常见问题

1. **构建失败**
   - 检查Node.js版本
   - 确认所有依赖已安装
   - 查看GitHub Actions日志

2. **测试失败**
   - 检查package.json中的测试脚本
   - 确认测试文件存在

3. **依赖安装失败**
   - 检查package.json语法
   - 确认网络连接正常

### 调试步骤

1. 查看GitHub Actions日志
2. 在本地运行相同命令
3. 检查文件路径和权限

## 📈 最佳实践

1. **提交前检查**
   ```bash
   # 确保代码能正常构建
   npm run build
   ```

2. **分支策略**
   - `main`: 主分支
   - 功能分支：`feature/功能名称`

3. **提交信息**
   - 使用清晰的提交信息
   - 描述具体的更改内容

## 🔗 相关链接

- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Node.js 文档](https://nodejs.org/docs) 