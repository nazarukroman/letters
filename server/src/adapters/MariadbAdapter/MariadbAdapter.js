import { DatabaseAdapter } from '../DatabaseAdapter.js';

export class MariadbAdapter extends DatabaseAdapter {
  constructor(pool) {
    super();
    this.pool = pool;
  }

  async query(sql, params = []) {
    let connection;

    try {
      connection = await this.pool.getConnection();
      return await connection.query(sql, params);
    } catch (err) {
      throw err;
    } finally {
      if (connection) {
        connection.end();
      }
    }
  }
}
