const mockDataStore: Record<string, any[]> = {}; // In-memory store to mock PostgreSQL data
let isPoolClosed = false; // Track if the pool is closed

// Mock pool object
const mockPool = {
  connect: jest.fn().mockImplementation(() => {
    if (isPoolClosed) {
      return Promise.reject(new Error('Pool is closed'));
    }
    return Promise.resolve(mockClient); // Return mock client on connect
  }),
  end: jest.fn().mockImplementation(() => {
    isPoolClosed = true;
    return Promise.resolve();
  }),
  query: jest.fn().mockImplementation((queryText: string, params?: any[]) => {
    if (isPoolClosed) {
      return Promise.reject(new Error('Pool is closed')); // Simulate error when querying after pool is closed
    }

    const trimmedQuery = queryText.trim();
    const [command] = trimmedQuery.split(' ');

    if (command.toLowerCase() === 'select') {
      const tableMatch = trimmedQuery.match(/FROM (\w+)/i);
      if (tableMatch) {
        const [, tableName] = tableMatch;
        return Promise.resolve({ rows: mockDataStore[tableName] || [] });
      }
      return Promise.resolve({ rows: [] });
    }

    if (command.toLowerCase() === 'insert') {
      const insertMatch = trimmedQuery.match(/INSERT INTO (\w+)/i);
      if (insertMatch) {
        const [, tableName] = insertMatch;
        if (!mockDataStore[tableName]) {
          mockDataStore[tableName] = [];
        }

        mockDataStore[tableName].push(params);
        return Promise.resolve({ rows: [params] });
      }
      return Promise.resolve({ rows: [] });
    }

    return Promise.resolve({ rows: [] }); // Default case for unsupported queries
  }),
};

// Mock client object
const mockClient = {
  query: mockPool.query,
  release: jest.fn().mockImplementation(() => {
    return Promise.resolve();
  }),
};

// Mock the Pool constructor function to return the mock pool
const Pool = jest.fn(() => mockPool);

export { Pool };