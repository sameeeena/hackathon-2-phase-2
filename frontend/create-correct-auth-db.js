const Database = require('better-sqlite3');
const fs = require('fs');

console.log('Recreating Better Auth database with CORRECT schema...');

// Remove the current database file
try {
    if (fs.existsSync('./auth_new.db')) {
        fs.unlinkSync('./auth_new.db');
        console.log('Removed current auth_new.db');
    }
} catch (error) {
    console.log('Could not remove existing file, continuing...');
}

// Create new database with EXACT Better Auth expected schema
const db = new Database('./auth_new_correct.db');

// Create tables with Better Auth expected schema (exact column names)
db.exec(`
-- User table with correct Better Auth schema
CREATE TABLE IF NOT EXISTS \`user\` (
  \`id\` TEXT NOT NULL PRIMARY KEY,
  \`email\` TEXT NOT NULL UNIQUE,
  \`emailVerified\` INTEGER DEFAULT 0,
  \`name\` TEXT,
  \`image\` TEXT,
  \`createdAt\` INTEGER NOT NULL DEFAULT (cast(unixepoch() as int)),
  \`updatedAt\` INTEGER NOT NULL DEFAULT (cast(unixepoch() as int))
);

-- Account table with correct Better Auth schema
CREATE TABLE IF NOT EXISTS \`account\` (
  \`id\` TEXT NOT NULL PRIMARY KEY,
  \`userId\` TEXT NOT NULL,
  \`providerId\` TEXT NOT NULL,
  \`accountId\` TEXT NOT NULL,  -- This is what Better Auth is looking for!
  \`accessToken\` TEXT,
  \`refreshToken\` TEXT,
  \`expiresAt\` INTEGER,
  \`tokenType\` TEXT,
  \`scope\` TEXT,
  \`createdAt\` INTEGER NOT NULL DEFAULT (cast(unixepoch() as int)),
  \`updatedAt\` INTEGER NOT NULL DEFAULT (cast(unixepoch() as int)),
  FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`)
);

-- Session table with correct Better Auth schema
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

-- Verification table with correct Better Auth schema
CREATE TABLE IF NOT EXISTS \`verification\` (
  \`id\` TEXT NOT NULL PRIMARY KEY,
  \`identifier\` TEXT NOT NULL,
  \`value\` TEXT NOT NULL,
  \`expiresAt\` INTEGER NOT NULL,
  \`type\` TEXT NOT NULL,
  \`createdAt\` INTEGER NOT NULL DEFAULT (cast(unixepoch() as int)),
  \`updatedAt\` INTEGER NOT NULL DEFAULT (cast(unixepoch() as int))
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_email ON \`user\` (\`email\`);
CREATE INDEX IF NOT EXISTS idx_session_user_id ON \`session\` (\`userId\`);
CREATE INDEX IF NOT EXISTS idx_verification_identifier_type ON \`verification\` (\`identifier\`, \`type\`);
`);

console.log('Better Auth database created with CORRECT schema');

// Verify the schema
console.log('\\nVerification - Account table structure (looking for "accountId"):');
const accountCols = db.prepare("PRAGMA table_info('account')").all();
accountCols.forEach(col => console.log(`  - ${col.name} (${col.type})`));

const hasAccountId = accountCols.some(col => col.name === 'accountId');
console.log(`\\nHas "accountId" column: ${hasAccountId ? '✅ YES' : '❌ NO'}`);

db.close();

console.log('\\n✅ Correct database created successfully!');