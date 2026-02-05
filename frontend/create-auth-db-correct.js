const Database = require('better-sqlite3');

// Remove the old database file
const fs = require('fs');
if (fs.existsSync('./auth.db')) {
    fs.unlinkSync('./auth.db');
    console.log('Removed old auth.db file');
}

const db = new Database('./auth.db');

// Create tables with Better Auth expected schema
db.exec(`
CREATE TABLE IF NOT EXISTS \`user\` (
  \`id\` TEXT NOT NULL PRIMARY KEY,
  \`email\` TEXT NOT NULL UNIQUE,
  \`emailVerified\` INTEGER DEFAULT 0,  -- camelCase as expected by Better Auth
  \`name\` TEXT,
  \`image\` TEXT,
  \`createdAt\` INTEGER NOT NULL DEFAULT (cast(unixepoch() as int)),  -- Changed to camelCase
  \`updatedAt\` INTEGER NOT NULL DEFAULT (cast(unixepoch() as int))   -- Changed to camelCase
);

CREATE TABLE IF NOT EXISTS \`account\` (
  \`id\` TEXT NOT NULL PRIMARY KEY,
  \`userId\` TEXT NOT NULL,  -- camelCase
  \`providerId\` TEXT NOT NULL,  -- camelCase
  \`providerAccountId\` TEXT NOT NULL,  -- camelCase
  \`accessToken\` TEXT,
  \`refreshToken\` TEXT,
  \`expiresAt\` INTEGER,
  \`tokenType\` TEXT,
  \`scope\` TEXT,
  \`createdAt\` INTEGER NOT NULL DEFAULT (cast(unixepoch() as int)),  -- camelCase
  \`updatedAt\` INTEGER NOT NULL DEFAULT (cast(unixepoch() as int)),  -- camelCase
  FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`)
);

CREATE TABLE IF NOT EXISTS \`session\` (
  \`id\` TEXT NOT NULL PRIMARY KEY,
  \`userId\` TEXT NOT NULL,  -- camelCase
  \`expiresAt\` INTEGER NOT NULL,  -- camelCase
  \`ipAddress\` TEXT,  -- camelCase
  \`userAgent\` TEXT,  -- camelCase
  \`createdAt\` INTEGER NOT NULL DEFAULT (cast(unixepoch() as int)),  -- camelCase
  \`updatedAt\` INTEGER NOT NULL DEFAULT (cast(unixepoch() as int)),  -- camelCase
  FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`)
);

CREATE TABLE IF NOT EXISTS \`verification\` (
  \`id\` TEXT NOT NULL PRIMARY KEY,
  \`identifier\` TEXT NOT NULL,
  \`value\` TEXT NOT NULL,
  \`expiresAt\` INTEGER NOT NULL,  -- camelCase
  \`type\` TEXT NOT NULL,
  \`createdAt\` INTEGER NOT NULL DEFAULT (cast(unixepoch() as int)),  -- camelCase
  \`updatedAt\` INTEGER NOT NULL DEFAULT (cast(unixepoch() as int))   -- camelCase
);

CREATE INDEX IF NOT EXISTS idx_user_email ON \`user\` (\`email\`);
CREATE INDEX IF NOT EXISTS idx_session_user_id ON \`session\` (\`userId\`);
CREATE INDEX IF NOT EXISTS idx_verification_identifier_type ON \`verification\` (\`identifier\`, \`type\`);
`);

console.log('Better Auth database created with correct schema');
console.log('Columns now use camelCase as expected by Better Auth');

db.close();