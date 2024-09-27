"use strict";

require('dotenv').config();

const dev = {
  db: {
    host: process.env.DEV_DB_HOST || 'localhost',
    port: process.env.DEV_DB_PORT || 27017,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'root',
    name: process.env.DEV_DB_NAME || 'shopDEV'
  }
};

const pro = {
  db: {
    host: process.env.PRO_DB_HOST || 'localhost',
    port: process.env.PRO_DB_PORT || 27017,
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || 'root',
    name: process.env.PRO_DB_NAME || 'shopDEV'
  }
};

const config = { dev, pro };
const env = process.env.NODE_ENV || 'dev';

module.exports = config[env];
