const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

console.log('Testing database connection...');
console.log('URL:', process.env.DATABASE_URL ? 'Found (hidden)' : 'Missing');

if (!process.env.DATABASE_URL) {
    console.error('Error: DATABASE_URL is not set in frontend/.env.local');
    process.exit(1);
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false 
    }
});

pool.connect()
    .then(client => {
        console.log('✅ Successfully connected to the database!');
        return client.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
            .then(res => {
                console.log('Tables in database:', res.rows.map(r => r.table_name));
                client.release();
                process.exit(0);
            });
    })
    .catch(err => {
        console.error('❌ Connection failed:', err);
        process.exit(1);
    });