import request from 'supertest';
import { app } from '../app';
import { connectRedis, closeRedis } from '../config/redisClient';
import { connectPostgres, closePostgres } from '../config/postgresClient';

jest.mock('redis'); // Mock Redis
jest.mock('pg'); // Mock PostgreSQL

describe('Express Application', () => {
  beforeAll(async () => {
    await connectRedis();
    await connectPostgres();
  });

  afterAll(async () => {
    await closeRedis();
    await closePostgres();
  });

  it('should respond with 200 on the index route', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.text).toContain('Hello, world!');
  });

  it('should handle non-existing routes with 404', async () => {
    const response = await request(app).get('/non-existing-route');
    expect(response.status).toBe(404);
  });

});