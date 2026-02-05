const Database = require('better-sqlite3');
const db = new Database('./auth.db');

// Get the users we just created
const users = db.prepare('SELECT id, email FROM user').all();
console.log('Users in database:', users);

// For email/password authentication, we need to create an account record with provider_id = 'credential'
users.forEach(user => {
    try {
        const now = Math.floor(Date.now() / 1000);
        const accountId = 'account_' + user.id.replace('user_', '');

        // Check if account already exists
        const existingAccount = db.prepare('SELECT id FROM account WHERE user_id = ? AND provider_id = ?').get(user.id, 'credential');

        if (!existingAccount) {
            const insertAccountStmt = db.prepare(`
                INSERT INTO account (id, user_id, provider_id, provider_account_id, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?)
            `);

            insertAccountStmt.run([
                accountId,
                user.id,
                'credential', // provider_id for email/password
                user.email,   // provider_account_id
                now,
                now
            ]);

            console.log('Created account for user:', user.email);
        } else {
            console.log('Account already exists for user:', user.email);
        }
    } catch (error) {
        console.error('Error creating account for user', user.email, ':', error.message);
    }
});

console.log('Updated account records for email/password authentication');

// Verify the changes
console.log('\\nVerifying user and account records:');
const allUsersWithAccounts = db.prepare(`
    SELECT u.id as user_id, u.email, u.name, a.id as account_id
    FROM user u
    LEFT JOIN account a ON u.id = a.user_id
    ORDER BY u.created_at DESC
`).all();
allUsersWithAccounts.forEach(record => {
    console.log(`${record.name} (${record.email}): account=${record.account_id || 'none'}`);
});

db.close();