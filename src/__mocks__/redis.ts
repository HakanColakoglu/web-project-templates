const mockDataStore: Record<string, string> = {}; // In-memory store to mock Redis data

const mockRedisClient = {
  isOpen: false,
  connect: jest.fn().mockImplementation(() => {
    mockRedisClient.isOpen = true;
    return Promise.resolve();
  }),
  quit: jest.fn().mockImplementation(() => {
    mockRedisClient.isOpen = false;
    return Promise.resolve();
  }),
  set: jest.fn().mockImplementation((key: string, value: string) => {
    mockDataStore[key] = value;
    return Promise.resolve('OK');
  }),
  get: jest.fn().mockImplementation((key: string) => {
    return Promise.resolve(mockDataStore[key] || null);
  }),
};

// Mock the createClient function to return the mockRedisClient
const createClient = jest.fn(() => mockRedisClient);

export { createClient };