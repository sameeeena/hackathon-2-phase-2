// Script to register test users via Better Auth API
// This ensures passwords are properly hashed and stored

const axios = require('axios');
const https = require('https');

// Disable SSL certificate validation for localhost development
const agent = new https.Agent({
  rejectUnauthorized: false
});

async function registerUser(userData) {
  try {
    const response = await axios.post(
      'http://localhost:3000/api/auth/sign-up/email',
      {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        confirmPassword: userData.password
      },
      {
        httpsAgent: agent,
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000 // 10 seconds timeout
      }
    );

    return { success: true, data: response.data };
  } catch (error) {
    if (error.response) {
      // Server responded with error status
      if (error.response.status === 409) {
        return { success: false, error: 'User already exists', status: 409 };
      }
      return {
        success: false,
        error: `HTTP ${error.response.status}: ${error.response.data?.message || error.response.statusText}`,
        status: error.response.status
      };
    } else if (error.request) {
      // Request was made but no response received
      return { success: false, error: 'No response from server. Is the Next.js server running?', status: null };
    } else {
      // Something else happened
      return { success: false, error: error.message, status: null };
    }
  }
}

async function createTestUsers() {
  console.log('Creating test users via Better Auth API...');
  console.log('(Note: This requires the Next.js development server to be running on port 3000)');
  console.log('');

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

  console.log('Attempting to register users...');

  for (const user of testUsers) {
    console.log(`\nRegistering: ${user.name} (${user.email})`);
    const result = await registerUser(user);

    if (result.success) {
      console.log(`✅ Successfully registered: ${user.name}`);
    } else {
      if (result.status === 409) {
        console.log(`⚠️  User already exists: ${user.email}`);
      } else {
        console.log(`❌ Failed to register ${user.name}: ${result.error}`);
      }
    }
  }

  console.log('\n📝 Registration process completed.');
  console.log('💡 Tip: If the server is not running, start it with: npm run dev');
}

// Run the function
createTestUsers().catch(console.error);