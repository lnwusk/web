const UserService = require('../services/userService');
const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

/**
 * UserController 处理用户相关的 HTTP 请求。
 * 单一职责：只处理请求和响应。
 */
class UserController {
  /**
   * 用户登录
   * @param {import('express').Request} req 
   * @param {import('express').Response} res 
   */
  static async login(req, res) {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: '用户名和密码必填' });
    }
    const user = await UserService.findByUsername(username);
    if (!user) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }
    const valid = await UserService.validatePassword(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: '用户名或密码错误' });
    }
    // 生成 JWT
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '7d' });
    res.json({ token, username: user.username });
  }

  /**
   * 用户注册
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  static async register(req, res) {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: '用户名和密码必填' });
    }
    const exist = await UserService.findByUsername(username);
    if (exist) {
      return res.status(409).json({ message: '用户名已存在' });
    }
    const user = await UserService.register(username, password);
    const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '7d' });
    res.json({ token, username: user.username });
  }
}

module.exports = UserController; 