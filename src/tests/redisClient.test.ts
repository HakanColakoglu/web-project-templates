import { redisClient, connectRedis, closeRedis } from '../config/redisClient';

jest.mock('redis'); // Use the mock implementation of 'redis'

describe('Redis Client', () => {
  beforeAll(async () => {
    await connectRedis();
  });

  afterAll(async () => {
    await closeRedis();
  });

  it('should connect to Redis successfully', async () => {
    expect(redisClient.isOpen).toBeTruthy();
  });

  it('should disconnect from Redis successfully', async () => {
    await closeRedis();
    expect(redisClient.isOpen).toBeFalsy();
  });

  it('should set and get a value in Redis', async () => {
    await redisClient.set('testKey', 'testValue');
    const value = await redisClient.get('testKey');
    expect(value).toBe('testValue');
  });

  it('should return null for non-existing keys', async () => {
    const value = await redisClient.get('nonExistingKey');
    expect(value).toBeNull();
  });
});
