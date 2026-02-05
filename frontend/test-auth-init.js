const { Pool } = require("pg");
require('dotenv').config({ path: '.env.local' });

async function run() {
    console.log('Initializing Pool with:', process.env.DATABASE_URL);
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    });

    console.log('Attempting pool.connect()...');
    try {
        const client = await pool.connect();
        console.log('✅ Connected successfully!');
        client.release();
    } catch (e) {
        console.error('❌ Connection failed:', e.message);
    }
    await pool.end();
}

run();
