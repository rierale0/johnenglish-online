const { OAuth2Client } = require('google-auth-library');

async function getAuthenticatedClient() {
  try {
    const client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN
    });

    return client;
  } catch (error) {
    console.error('Authentication error:', error);
    throw new Error('Failed to authenticate with Google API');
  }
}

module.exports = { getAuthenticatedClient };