const axios = require('axios');

let token = '';

const generateAuthToken = async () => {
  try {
    const response = await axios.post(
      'https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token',
      {
        client_version: '1',
        client_id: process.env.PHONEPE_CLIENT_ID,
        client_secret: process.env.PHONEPE_CLIENT_SECRET,
        grant_type: 'client_credentials',
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    token = `O-Bearer ${response.data.access_token}`;
    console.log('🔑 New token generated at', new Date().toLocaleTimeString());
  } catch (error) {
    console.error('❌ Error generating token:', error.message);
  }
};

const getToken = () => token;

module.exports = { generateAuthToken, getToken };