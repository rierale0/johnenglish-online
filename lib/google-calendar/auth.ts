import { OAuth2Client } from 'google-auth-library';

const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Initialize with refresh token
oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

// Add token refresh handler
oauth2Client.on('tokens', (tokens) => {
  if (tokens.refresh_token) {
    // Store the new refresh token if provided
    console.log('New refresh token received:', tokens.refresh_token);
  }
  if (tokens.access_token) {
    // Store the new access token
    console.log('New access token received');
  }
});

export async function getAuthenticatedClient() {
  try {
    // This will automatically refresh the token if needed
    const { token } = await oauth2Client.getAccessToken();
    
    if (!token) {
      throw new Error('Failed to obtain access token');
    }

    return oauth2Client;
  } catch (error) {
    console.error('Authentication error:', error);
    throw new Error(`Authentication failed: ${error.message}`);
  }
}