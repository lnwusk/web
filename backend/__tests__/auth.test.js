const request = require('supertest');
const app = require('../index');

describe('Authentication', () => {
  test('should register a new user', async () => {
    const userData = {
      username: 'testuser',
      password: 'testpassword123'
    };

    const response = await request(app)
      .post('/api/register')
      .send(userData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('user');
    expect(response.body.user).toHaveProperty('username', userData.username);
  });

  test('should login with valid credentials', async () => {
    const loginData = {
      username: 'testuser',
      password: 'testpassword123'
    };

    const response = await request(app)
      .post('/api/login')
      .send(loginData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('username');
  });

  test('should reject invalid login credentials', async () => {
    const loginData = {
      username: 'testuser',
      password: 'wrongpassword'
    };

    const response = await request(app)
      .post('/api/login')
      .send(loginData);

    expect(response.status).toBe(401);
  });
}); 