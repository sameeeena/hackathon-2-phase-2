const Database = require('better-sqlite3');

const db = new Database('./auth.db');

// Delete all users and their associated accounts
function cleanupUsers() {
    console.log('Cleaning up existing test users...');

    // Delete accounts first (due to foreign key constraint)
    const deleteAccounts = db.prepare("DELETE FROM account WHERE user_id IN (SELECT id FROM user WHERE email LIKE '%@example.com' OR email LIKE '%ayeshabano%' OR email LIKE '%sameena%')");
    const accountsDeleted = deleteAccounts.run();

    // Delete users
    const deleteUsers = db.prepare("DELETE FROM user WHERE email LIKE '%@example.com' OR email LIKE '%ayeshabano%' OR email LIKE '%sameena%'");
    const usersDeleted = deleteUsers.run();

    console.log(`Deleted ${usersDeleted.changes} users and ${accountsDeleted.changes} accounts`);

    // Verify deletion
    const remainingUsers = db.prepare('SELECT COUNT(*) as count FROM user').get().count;
    console.log(`Remaining users in database: ${remainingUsers}`);
}

cleanupUsers();
db.close();

console.log('Cleanup completed. You can now register users properly via the API.');