const { Client } = require("pg");
require("dotenv").config();
const connectionString = process.env.DATABASE_URL || 'https://postgres:admin@localhost:5433/e-commerce';

const client = new Client({
    connectionString,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});


module.exports = client;
