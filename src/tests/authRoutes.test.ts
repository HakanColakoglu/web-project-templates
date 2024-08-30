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

  describe('Session Management', () => {
    let cookie: string;

    it('should log in successfully and create a session', async () => {
      // First, sign up a user
      await request(app).post('/auth/signup').send({
        username: 'sessiontestuser',
        password: 'password123',
      });

      // Then, sign in with the new user
      const response = await request(app).post('/auth/signin').send({
        username: 'sessiontestuser',
        password: 'password123',
      });

      expect(response.status).toBe(302); // Check for successful redirect
      expect(response.header['set-cookie']).toBeDefined(); // Check that cookies are set
      cookie = response.header['set-cookie'][0].split(';')[0]; // Extract cookie for session
    });

    it('should allow access to protected route with valid session', async () => {
      // Access the protected route with the session cookie
      const response = await request(app)
        .get('/protected')
        .set('Cookie', cookie);

      expect(response.status).toBe(200); // Expect successful access
      expect(response.text).toContain('User: sessiontestuser!'); // Check for correct response
    });

    it('should log out successfully and destroy the session', async () => {
      // Log out the user
      const response = await request(app).post('/auth/logout').set('Cookie', cookie);

      expect(response.status).toBe(200); // Expect successful logout

      // Try to access the protected route again with the same cookie
      const protectedResponse = await request(app)
        .get('/protected')
        .set('Cookie', cookie);

      expect(protectedResponse.status).toBe(401); // Expect Unauthorized due to session destruction
    });
  });
});