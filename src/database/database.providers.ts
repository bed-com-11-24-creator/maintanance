import oracledb from 'oracledb';

let pool: oracledb.Pool;

export async function initDB() {
  pool = await oracledb.createPool({
    user: 'system',
    password: '@PRai204se',
    connectString: 'localhost:1521/XE',
  });
  console.log(' Oracle DB connected');
}

export async function getConnection() {
  return await pool.getConnection();
}