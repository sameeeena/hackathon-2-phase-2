// First, rename the databases using a node script
const fs = require('fs');

console.log('Renaming database files...');

try {
    // Try to rename the old database
    if (fs.existsSync('./auth.db')) {
        if (fs.existsSync('./auth_old.db')) {
            fs.unlinkSync('./auth_old.db');
        }
        fs.renameSync('./auth.db', './auth_old.db');
        console.log('Backed up old auth.db to auth_old.db');
    }

    // Rename the new database
    if (fs.existsSync('./auth_new.db')) {
        fs.renameSync('./auth_new.db', './auth.db');
        console.log('Renamed auth_new.db to auth.db');
    }

    console.log('Database swap completed successfully!');

    // Verify the database exists and has correct schema
    const Database = require('better-sqlite3');
    const db = new Database('./auth.db');

    console.log('Verifying database schema...');
    const userCols = db.prepare("PRAGMA table_info('user')").all();
    const hasEmailVerified = userCols.some(col => col.name === 'emailVerified');
    const hasCreatedAt = userCols.some(col => col.name === 'createdAt');

    if (hasEmailVerified && hasCreatedAt) {
        console.log('✅ Database has correct Better Auth schema (camelCase columns)');
    } else {
        console.log('❌ Database schema is incorrect');
    }

    db.close();
} catch (error) {
    console.error('Error during database swap:', error.message);
}