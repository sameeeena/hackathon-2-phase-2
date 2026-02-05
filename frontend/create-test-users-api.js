// Script to programmatically create test users using Better Auth API
// This approach ensures passwords are properly hashed and stored

const { spawn } = require('child_process');
const axios = require('axios');

async function createTestUsersViaAPI() {
    console.log('Creating test users via Better Auth API...\n');

    // Start the Next.js development server in the background
    console.log('Starting Next.js development server...');
    const serverProcess = spawn('npm', ['run', 'dev'], {
        cwd: './frontend',
        stdio: ['pipe', 'pipe', 'pipe'],
        shell: true
    });

    // Wait for the server to start
    await new Promise(resolve => setTimeout(resolve, 5000));

    const baseUrl = 'http://localhost:3000';

    const testUsers = [
        {
            name: 'Aysha Bano',
            email: 'ayeshabano289@gmail.com',
            password: 'password123'
        },
        {
            name: 'Sameena',
            email: 'sameena02134@gmail.com',
            password: 'password123'
        },
        {
            name: 'Test User',
            email: 'testuser@example.com',
            password: 'password123'
        },
        {
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'admin123'
        }
    ];

    for (const user of testUsers) {
        try {
            console.log(`Creating user: ${user.name} (${user.email})`);

            // Register the user via API
            const response = await axios.post(`${baseUrl}/api/auth/sign-up/email`, {
                name: user.name,
                email: user.email,
                password: user.password,
                confirmPassword: user.password
            });

            if (response.status === 200) {
                console.log(`✅ Successfully created user: ${user.name}`);
            } else {
                console.log(`⚠️ Failed to create user ${user.name}: ${response.status}`);
            }
        } catch (error) {
            if (error.response && error.response.status === 409) {
                console.log(`⚠️ User ${user.email} already exists`);
            } else {
                console.log(`❌ Error creating user ${user.name}:`, error.message);
            }
        }
    }

    // Stop the server
    serverProcess.kill();
    console.log('\n📊 Test user creation process completed.');
}

// Alternative approach: Direct database manipulation (may not work properly for password auth)
function createTestUsersDirectly() {
    console.log('Creating test users directly in database (without passwords)...');
    console.log('Note: This approach may not allow password login without proper password storage.');
}

// Determine which approach to use
if (process.argv[2] === '--api') {
    createTestUsersViaAPI().catch(console.error);
} else {
    console.log('Creating test users directly in database...');
    console.log('Note: This approach may not work properly for password authentication.');
    console.log('For proper password authentication, run: node create-test-users.js --api');

    // Execute the original direct approach
    require('./create-test-users-original');
}