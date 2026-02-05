const Database = require('better-sqlite3');
const fs = require('fs');

console.log('Recreating Better Auth database with correct schema...');

// Try to remove the existing file first
try {
    if (fs.existsSync('./auth.db')) {
        // Close any connections and remove file
        console.log('Removing old auth.db file...');
        fs.rmSync('./auth.db');
    }
} catch (error) {
    console.log('Could not remove existing file, proceeding anyway...');
}

// Create new database with correct schema
const db = new Database('./auth.db');

// Create tables with Better Auth expected schema (camelCase columns)
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
  \`providerAccountId\` TEXT NOT NULL,
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

console.log('Better Auth database created with correct camelCase schema');
console.log('Table structure:');
console.log('- user: id, email, emailVerified, name, image, createdAt, updatedAt');
console.log('- account: id, userId, providerId, providerAccountId, accessToken, refreshToken, expiresAt, tokenType, scope, createdAt, updatedAt');
console.log('- session: id, userId, expiresAt, ipAddress, userAgent, createdAt, updatedAt');
console.log('- verification: id, identifier, value, expiresAt, type, createdAt, updatedAt');

// Verify the schema
console.log('\nVerification - User table structure:');
const userCols = db.prepare("PRAGMA table_info('user')").all();
userCols.forEach(col => console.log(`  - ${col.name} (${col.type})`));

db.close();

console.log('\n✅ Database recreated successfully with correct schema!');