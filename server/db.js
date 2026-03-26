import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'supervillage',
  port: parseInt(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
};

// Enable SSL for cloud MySQL providers (Aiven, PlanetScale, Railway, etc.)
if (process.env.DB_SSL === 'true') {
  dbConfig.ssl = { rejectUnauthorized: true };
}

// Support single DATABASE_URL connection string (used by many cloud providers)
const pool = process.env.DATABASE_URL
  ? mysql.createPool(process.env.DATABASE_URL)
  : mysql.createPool(dbConfig);

export default pool;
