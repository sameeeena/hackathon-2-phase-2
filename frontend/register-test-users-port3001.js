// Script to register test users via Better Auth API on port 3001
const axios = require('axios');

async function registerUser(userData) {
  try {
    const response = await axios.post(
      'http://localhost:3001/api/auth/sign-up/email',
      {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        confirmPassword: userData.password
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000
      }
    );

    return { success: true, data: response.data };
  } catch (error) {
    if (error.response) {
      if (error.response.status === 409) {
        return { success: false, error: 'User already exists', status: 409 };
      }
      return {
        success: false,
        error: 'HTTP ' + error.response.status + ': ' + (error.response.data?.message || error.response.statusText),
        status: error.response.status
      };
    } else if (error.request) {
      return { success: false, error: 'No response from server', status: null };
    } else {
      return { success: false, error: error.message, status: null };
    }
  }
}

async function createTestUsers() {
  console.log('Creating test users via Better Auth API on port 3001...');

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
    console.log('\nRegistering: ' + user.name + ' (' + user.email + ')');
    const result = await registerUser(user);

    if (result.success) {
      console.log('✅ Successfully registered: ' + user.name);
    } else {
      if (result.status === 409) {
        console.log('⚠️  User already exists: ' + user.email);
      } else {
        console.log('❌ Failed to register ' + user.name + ': ' + result.error);
      }
    }
  }

  console.log('\n📝 Registration process completed.');
}

createTestUsers().catch(console.error);