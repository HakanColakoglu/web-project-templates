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
  del: jest.fn().mockImplementation((key: string) => {
    delete mockDataStore[key];
    return Promise.resolve(1); // Return 1 to simulate successful deletion
  }),
  exists: jest.fn().mockImplementation((key: string) => {
    return Promise.resolve(key in mockDataStore ? 1 : 0); // Simulate Redis' EXISTS command
  }),
};

// Mock the createClient function to return the mockRedisClient
const createClient = jest.fn(() => mockRedisClient);

export { createClient };