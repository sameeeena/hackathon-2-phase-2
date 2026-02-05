const { betterAuth } = require("better-auth");
const Database = require("better-sqlite3");
const { toNodeListener } = require("better-auth/node");

// Create auth instance with explicit SQLite configuration
const auth = betterAuth({
    database: new Database("./frontend/auth.db"),
    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
        requireEmailVerification: false,
    },
    session: {
        strategy: "jwt",
        expiresIn: 7 * 24 * 60 * 60, // 7 days
    }
});

console.log("Attempting to initialize Better Auth...");

// This should trigger table creation
async function testAuth() {
    try {
        // Force table creation by accessing the database
        console.log("Checking database tables...");

        const db = new Database("./frontend/auth.db");
        const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table';").all();
        console.log("Existing tables:", tables);

        db.close();

        console.log("Auth instance created successfully!");
    } catch (error) {
        console.error("Error initializing auth:", error);
    }
}

testAuth();