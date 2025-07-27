const User = require('../models/user');
const bcrypt = require('bcrypt');

/**
 * UserService 提供用户相关的业务逻辑。
 * 单一职责：只处理用户数据的获取和密码校验。
 */
class UserService {
  /**
   * 根据用户名查找用户
   * @param {string} username 
   * @returns {Promise<User|null>}
   */
  static async findByUsername(username) {
    return await User.findOne({ where: { username } });
  }

  /**
   * 校验密码
   * @param {string} plainPassword 
   * @param {string} hash 
   * @returns {Promise<boolean>}
   */
  static async validatePassword(plainPassword, hash) {
    return await bcrypt.compare(plainPassword, hash);
  }

  /**
   * 注册新用户
   * @param {string} username
   * @param {string} password
   * @returns {Promise<User>}
   */
  static async register(username, password) {
    const bcrypt = require('bcrypt');
    const hash = await bcrypt.hash(password, 10);
    return await User.create({ username, password: hash });
  }
}

module.exports = UserService; 