require('dotenv').config();
require('ts-node/register');
const path = require('path');

const getDatabaseConnection = () => {
  // If DATABASE_URL is provided (Railway style), use it directly
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }
  
  // Otherwise, use individual connection parameters
  if (process.env.DB_CLIENT === 'mysql2') {
    return {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    };
  }
  
  // Default to SQLite
  return {
    filename: path.resolve(__dirname, './data/dev.sqlite3')
  };
};

module.exports = {
  development: {
    client: process.env.DB_CLIENT || 'sqlite3',
    connection: getDatabaseConnection(),
    useNullAsDefault: true,
    migrations: {
      directory: path.resolve(__dirname, './src/migrations'),
      extension: 'ts'
    },
    seeds: {
      directory: path.resolve(__dirname, './src/seeds')
    }
  },

  production: {
    client: process.env.DB_CLIENT || 'sqlite3',
    connection: getDatabaseConnection(),
    useNullAsDefault: true,
    migrations: {
      directory: path.resolve(__dirname, './src/migrations'),
      extension: 'ts'
    },
    pool: {
      min: 2,
      max: 10
    }
  }
};
