// Script to test login with existing users

const axios = require('axios');
const https = require('https');

// Disable SSL certificate validation for localhost development
const agent = new https.Agent({
  rejectUnauthorized: false
});

async function loginUser(credentials) {
  try {
    const response = await axios.post(
      'http://localhost:3000/api/auth/sign-in/email',
      {
        email: credentials.email,
        password: credentials.password
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
      return {
        success: false,
        error: `HTTP ${error.response.status}: ${error.response.data?.message || error.response.statusText}`,
        status: error.response.status
      };
    } else if (error.request) {
      return { success: false, error: 'No response from server. Is the Next.js server running?', status: null };
    } else {
      return { success: false, error: error.message, status: null };
    }
  }
}

async function testLogin() {
  console.log('Testing login with manually created users...');

  // Test with one of the users I created
  const testCredentials = [
    {
      email: 'ayeshabano289@gmail.com',
      password: 'password123'  // This would fail since we didn't store the password properly
    },
    {
      email: 'sameena02134@gmail.com',
      password: 'password123'
    }
  ];

  for (const creds of testCredentials) {
    console.log(`\nTesting login for: ${creds.email}`);
    const result = await loginUser(creds);

    if (result.success) {
      console.log(`✅ Login successful for: ${creds.email}`);
    } else {
      console.log(`❌ Login failed for ${creds.email}: ${result.error}`);

      // If the error is "User not found", it means our manual database entry didn't work properly
      if (result.error.includes("User not found")) {
        console.log(`   → Need to properly register this user via API to store password`);
      }
    }
  }
}

// Run the function
testLogin().catch(console.error);