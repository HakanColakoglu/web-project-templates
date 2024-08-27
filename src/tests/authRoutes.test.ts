import request from 'supertest';
import { app, connectRedis, closeRedis, connectPostgres, closePostgres } from '../app';
import bcrypt from 'bcrypt';

jest.mock('redis'); // Mock Redis
jest.mock('pg'); // Mock PostgreSQL

describe('Authentication Routes', () => {
  beforeAll(async () => {
    await connectRedis();
    await connectPostgres();
  });

  afterAll(async () => {
    await closeRedis();
    await closePostgres();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/signup', () => {
    it('should sign up a new user successfully', async () => {
      const response = await request(app).post('/auth/signup').send({
        username: 'signintestuser',
        password: 'password123',
      });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('User created successfully');
      console.log("User content:", response.body);

      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user).toHaveProperty('username', 'signintestuser');
    });

    it('should not allow sign-up with an existing username', async () => {
      // First signup
      await request(app).post('/auth/signup').send({
        username: 'duplicateuser',
        password: 'password123',
      });

      // Attempt to sign up with the same username
      const response = await request(app).post('/auth/signup').send({
        username: 'duplicateuser',
        password: 'newpassword456',
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Username already exists');
    });
  });

  describe('POST /auth/signin', () => {
    beforeAll(async () => {
      // Ensure user exists for sign-in test
      const password = await bcrypt.hash('password123', 10);
      await request(app).post('/auth/signup').send({
        username: 'signintestuser',
        password,
      });
    });

    it('should sign in successfully with correct credentials', async () => {
      const response = await request(app).post('/auth/signin').send({
        username: 'signintestuser',
        password: 'password123',
      });

      expect(response.status).toBe(302); // Redirect status for successful login
      expect(response.header.location).toBe('/'); // Check for success redirect
    });

    it('should fail to sign in with incorrect credentials', async () => {
      const response = await request(app).post('/auth/signin').send({
        username: 'signintestuser',
        password: 'wrongpassword',
      });

      expect(response.status).toBe(302); // Redirect status for failure
      expect(response.header.location).toBe('/auth/signin'); // Check for failure redirect
    });
  });

  describe('POST /auth/logout', () => {
    it('should log out a user successfully', async () => {
      const response = await request(app).post('/auth/logout');
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('User logged out successfully');
    });
  });
});