import { pool, connectPostgres, closePostgres } from '../config/postgresClient';

jest.mock('pg'); // This tells Jest to use the mock implementation of 'pg'

describe('PostgreSQL Client', () => {
  beforeAll(async () => {
    await connectPostgres();
  });

  afterAll(async () => {
    await closePostgres();
  });

  it('should connect to PostgreSQL successfully', async () => {
    const client = await pool.connect();
    expect(client).toBeDefined();
    await client.release();
  });

  it('should insert and select data correctly', async () => {
    await pool.query('INSERT INTO testTable (id, name) VALUES ($1, $2)', [1, 'John Doe']);
    const result = await pool.query('SELECT * FROM testTable');
    expect(result.rows).toEqual([[1, 'John Doe']]);
  });

  it('should return an empty array for selecting from an empty table', async () => {
    const result = await pool.query('SELECT * FROM emptyTable');
    expect(result.rows).toEqual([]);
  });

  it('should disconnect from PostgreSQL successfully', async () => {
    await closePostgres();
    await expect(pool.query('SELECT * FROM testTable')).rejects.toThrow();
  });
});
