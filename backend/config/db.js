const mysql = require('mysql2/promise');
require('dotenv').config();

let pool;

const connectDB = async () => {
  pool = mysql.createPool({
    host:               process.env.DB_HOST,
    user:               process.env.DB_USER,
    password:           process.env.DB_PASSWORD,
    database:           process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit:    10,
  });
};

connectDB();

module.exports = {
  query: (...args) => pool.query(...args),
  execute: (...args) => pool.execute(...args),
};