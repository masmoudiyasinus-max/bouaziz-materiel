import mariadb from 'mariadb';

async function testConnection() {
  const pool = mariadb.createPool({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '',
    database: 'bouaziz_agri',
    connectionLimit: 5
  });

  try {
    const conn = await pool.getConnection();
    console.log("Connected to MariaDB successfully!");
    const rows = await conn.query("SELECT 1 as val");
    console.log(rows);
    await conn.end();
  } catch (err) {
    console.error("Connection failed:", err);
  } finally {
    await pool.end();
  }
}

testConnection();
