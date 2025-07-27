import axios from 'axios';

/**
 * 登录 API
 * @param {string} username 
 * @param {string} password 
 * @returns {Promise<{token: string, username: string}>}
 */
export async function login(username, password) {
  const res = await axios.post('/api/login', { username, password });
  return res.data;
} 