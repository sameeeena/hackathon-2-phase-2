const Database = require('better-sqlite3');

const db = new Database('./frontend/auth.db');

// Create tables that Better Auth expects
db.exec(`
CREATE TABLE IF NOT EXISTS \`user\` (
  \`id\` TEXT NOT NULL PRIMARY KEY,
  \`email\` TEXT NOT NULL UNIQUE,
  \`email_verified\` INTEGER DEFAULT 0,
  \`name\` TEXT,
  \`image\` TEXT,
  \`created_at\` INTEGER NOT NULL DEFAULT (cast(unixepoch() as int)),
  \`updated_at\` INTEGER NOT NULL DEFAULT (cast(unixepoch() as int))
);

CREATE TABLE IF NOT EXISTS \`account\` (
  \`id\` TEXT NOT NULL PRIMARY KEY,
  \`user_id\` TEXT NOT NULL,
  \`provider_id\` TEXT NOT NULL,
  \`provider_account_id\` TEXT NOT NULL,
  \`access_token\` TEXT,
  \`refresh_token\` TEXT,
  \`expires_at\` INTEGER,
  \`token_type\` TEXT,
  \`scope\` TEXT,
  \`created_at\` INTEGER NOT NULL DEFAULT (cast(unixepoch() as int)),
  \`updated_at\` INTEGER NOT NULL DEFAULT (cast(unixepoch() as int)),
  FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`)
);

CREATE TABLE IF NOT EXISTS \`session\` (
  \`id\` TEXT NOT NULL PRIMARY KEY,
  \`user_id\` TEXT NOT NULL,
  \`expires_at\` INTEGER NOT NULL,
  \`ip_address\` TEXT,
  \`user_agent\` TEXT,
  \`created_at\` INTEGER NOT NULL DEFAULT (cast(unixepoch() as int)),
  \`updated_at\` INTEGER NOT NULL DEFAULT (cast(unixepoch() as int)),
  FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`)
);

CREATE TABLE IF NOT EXISTS \`verification\` (
  \`id\` TEXT NOT NULL PRIMARY KEY,
  \`identifier\` TEXT NOT NULL,
  \`value\` TEXT NOT NULL,
  \`expires_at\` INTEGER NOT NULL,
  \`type\` TEXT NOT NULL,
  \`created_at\` INTEGER NOT NULL DEFAULT (cast(unixepoch() as int)),
  \`updated_at\` INTEGER NOT NULL DEFAULT (cast(unixepoch() as int))
);

CREATE INDEX IF NOT EXISTS idx_user_email ON \`user\` (\`email\`);
CREATE INDEX IF NOT EXISTS idx_session_user_id ON \`session\` (\`user_id\`);
CREATE INDEX IF NOT EXISTS idx_verification_identifier_type ON \`verification\` (\`identifier\`, \`type\`);
`);

console.log('Better Auth tables created successfully');
db.close();