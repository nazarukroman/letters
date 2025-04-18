import mariadb from 'mariadb';

export const mariadbPool = mariadb.createPool({
  host: process.env.DB_HOST,
  database: process.env.MYSQL_DATABASE,
  port: process.env.DB_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  connectionLimit: 5,
});
