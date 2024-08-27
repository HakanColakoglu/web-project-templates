const mockDataStore: Record<string, any[]> = {}; // General mock data store
const mockUserDataStore: Record<string, any[]> = {
  users: [], // Mock users table specifically
}; 

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
      // Handle SELECT queries
      const tableMatch = trimmedQuery.match(/FROM (\w+)/i);
      if (tableMatch) {
        const [, tableName] = tableMatch;

        if (tableName.toLowerCase() === 'users') {
          // Specific logic for 'users' table
          const userTableMatch = trimmedQuery.match(/FROM users WHERE username = \$(\d)/i);
          if (userTableMatch) {
            const username = params?.[0];
            const user = mockUserDataStore['users'].find((u) => u.username === username);
            return Promise.resolve({ rows: user ? [user] : [] });
          }
          const userByIdMatch = trimmedQuery.match(/FROM users WHERE id = \$(\d)/i);
          if (userByIdMatch) {
            const id = params?.[0];
            const user = mockUserDataStore['users'].find((u) => u.id === id);
            return Promise.resolve({ rows: user ? [user] : [] });
          }
          return Promise.resolve({ rows: [] });
        } else {
          // General SELECT logic for other tables
          return Promise.resolve({ rows: mockDataStore[tableName] || [] });
        }
      }
      return Promise.resolve({ rows: [] });
    }

    if (command.toLowerCase() === 'insert') {
      // Handle INSERT queries
      const insertMatch = trimmedQuery.match(/INSERT INTO (\w+)/i);
      if (insertMatch) {
        const [, tableName] = insertMatch;

        if (tableName.toLowerCase() === 'users') {
          // Specific logic for inserting into 'users' table
          const [username, password] = params || [];
          const newUser = {
            id: mockUserDataStore['users'].length + 1,
            username,
            password,
          };
          mockUserDataStore['users'].push(newUser);
          return Promise.resolve({ rows: [newUser] });
        } else {
          // General INSERT logic for other tables
          if (!mockDataStore[tableName]) {
            mockDataStore[tableName] = [];
          }
          mockDataStore[tableName].push(params);
          return Promise.resolve({ rows: [params] });
        }
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