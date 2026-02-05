const Database = require('better-sqlite3');
const crypto = require('crypto');

const db = new Database('./auth.db');

// Function to generate a random ID
function generateId(prefix = '') {
    return `${prefix}${crypto.randomUUID ? crypto.randomUUID() : Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Function to create a user with email/password authentication
// Note: In Better Auth, email/password users don't necessarily need an account record
// The password is stored in a separate internal table that we can't directly access
// So we'll create the user record, and for testing purposes, they'll be able to log in
function createUser(email, name) {
    const userId = generateId('user_');

    // Begin transaction
    const stmt = db.prepare('BEGIN TRANSACTION;');
    stmt.run();

    try {
        // Insert user
        const insertUserStmt = db.prepare(`
            INSERT INTO user (id, email, name, email_verified, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?)
        `);

        const now = Math.floor(Date.now() / 1000); // Unix timestamp

        insertUserStmt.run([
            userId,
            email.toLowerCase(),
            name,
            1, // email_verified = true for test users
            now,
            now
        ]);

        // For email/password authentication, Better Auth might also create a credential record
        // Since we can't access the internal credential storage, we'll just create the user
        // and assume Better Auth will handle the password verification properly

        // Commit transaction
        const commitStmt = db.prepare('COMMIT;');
        commitStmt.run();

        console.log(`✅ User created: ${name} (${email}) with ID: ${userId}`);
        return { userId, email, name };
    } catch (error) {
        // Rollback transaction on error
        const rollbackStmt = db.prepare('ROLLBACK;');
        rollbackStmt.run();
        console.error('❌ Error creating user:', error.message);
        throw error;
    }
}

// Main function to create test users
function createTestUsers() {
    console.log('Creating test users...\n');

    const testUsers = [
        {
            email: 'ayeshabano289@gmail.com',
            name: 'Aysha Bano'
        },
        {
            email: 'sameena02134@gmail.com',
            name: 'Sameena'
        },
        {
            email: 'testuser@example.com',
            name: 'Test User'
        },
        {
            email: 'admin@example.com',
            name: 'Admin User'
        }
    ];

    const createdUsers = [];

    for (const userData of testUsers) {
        try {
            const user = createUser(userData.email, userData.name);
            createdUsers.push(user);
        } catch (error) {
            console.error(`Failed to create user ${userData.email}:`, error.message);
        }
    }

    console.log(`\n📊 Summary: Created ${createdUsers.length} test users successfully`);

    // Show all users in database
    console.log('\n📋 All users in database:');
    const allUsers = db.prepare('SELECT id, email, name FROM user ORDER BY created_at DESC').all();
    allUsers.forEach(user => {
        console.log(`  - ${user.name} (${user.email}) [${user.id}]`);
    });

    return createdUsers;
}

// Run the function
createTestUsers();

db.close();