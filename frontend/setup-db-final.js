const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);
const Database = require('better-sqlite3');
const fs = require('fs');

async function setupCorrectDatabase() {
    console.log('Setting up Better Auth database with correct schema...');

    try {
        // Kill any node processes that might be holding the file
        console.log('Stopping any running processes...');
        try {
            await execAsync('taskkill /F /IM node.exe 2>nul || true');
        } catch (e) {
            // Ignore errors when killing processes
        }

        // Small delay to let processes close
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Remove the lock directory
        if (fs.existsSync('./.next')) {
            await execAsync('rm -rf ./.next');
        }

        // Remove old database if it exists
        if (fs.existsSync('./auth.db')) {
            fs.unlinkSync('./auth.db');
        }

        // Create database with correct schema
        const db = new Database('./auth.db');

        // Create tables with Better Auth expected schema
        db.exec(`
        CREATE TABLE IF NOT EXISTS \`user\` (
          \`id\` TEXT NOT NULL PRIMARY KEY,
          \`email\` TEXT NOT NULL UNIQUE,
          \`emailVerified\` INTEGER DEFAULT 0,
          \`name\` TEXT,
          \`image\` TEXT,
          \`createdAt\` INTEGER NOT NULL DEFAULT (cast(unixepoch() as int)),
          \`updatedAt\` INTEGER NOT NULL DEFAULT (cast(unixepoch() as int))
        );

        CREATE TABLE IF NOT EXISTS \`account\` (
          \`id\` TEXT NOT NULL PRIMARY KEY,
          \`userId\` TEXT NOT NULL,
          \`providerId\` TEXT NOT NULL,
          \`accountId\` TEXT NOT NULL,
          \`accessToken\` TEXT,
          \`refreshToken\` TEXT,
          \`expiresAt\` INTEGER,
          \`tokenType\` TEXT,
          \`scope\` TEXT,
          \`createdAt\` INTEGER NOT NULL DEFAULT (cast(unixepoch() as int)),
          \`updatedAt\` INTEGER NOT NULL DEFAULT (cast(unixepoch() as int)),
          FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`)
        );

        CREATE TABLE IF NOT EXISTS \`session\` (
          \`id\` TEXT NOT NULL PRIMARY KEY,
          \`userId\` TEXT NOT NULL,
          \`expiresAt\` INTEGER NOT NULL,
          \`ipAddress\` TEXT,
          \`userAgent\` TEXT,
          \`createdAt\` INTEGER NOT NULL DEFAULT (cast(unixepoch() as int)),
          \`updatedAt\` INTEGER NOT NULL DEFAULT (cast(unixepoch() as int)),
          FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`)
        );

        CREATE TABLE IF NOT EXISTS \`verification\` (
          \`id\` TEXT NOT NULL PRIMARY KEY,
          \`identifier\` TEXT NOT NULL,
          \`value\` TEXT NOT NULL,
          \`expiresAt\` INTEGER NOT NULL,
          \`type\` TEXT NOT NULL,
          \`createdAt\` INTEGER NOT NULL DEFAULT (cast(unixepoch() as int)),
          \`updatedAt\` INTEGER NOT NULL DEFAULT (cast(unixepoch() as int))
        );

        CREATE INDEX IF NOT EXISTS idx_user_email ON \`user\` (\`email\`);
        CREATE INDEX IF NOT EXISTS idx_session_user_id ON \`session\` (\`userId\`);
        CREATE INDEX IF NOT EXISTS idx_verification_identifier_type ON \`verification\` (\`identifier\`, \`type\`);
        `);

        console.log('✅ Database created with correct schema');

        // Verify schema
        const userCols = db.prepare("PRAGMA table_info('user')").all();
        const accountCols = db.prepare("PRAGMA table_info('account')").all();

        console.log('\\nUser table columns:');
        userCols.forEach(col => console.log(`  - ${col.name}`));

        console.log('\\nAccount table columns:');
        accountCols.forEach(col => console.log(`  - ${col.name}`));

        db.close();

        console.log('\\n✅ Database setup complete!');

    } catch (error) {
        console.error('❌ Error setting up database:', error.message);
    }
}

setupCorrectDatabase();