const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || 'hostel_complaints',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
pool.getConnection()
  .then(connection => {
    console.log('✅ MySQL Database connected successfully');
    connection.release();
  })
  .catch(err => {
    console.error('❌ MySQL connection error:', err);
    process.exit(-1);
  });

module.exports = {
  query: async (text, params) => {
    const [rows] = await pool.execute(text, params);
    // For MySQL, rows is the actual result
    // For INSERT: rows has insertId and affectedRows
    // For SELECT: rows is array of results
    // For UPDATE/DELETE: rows has affectedRows
    return { rows };
  },
  pool,
};
