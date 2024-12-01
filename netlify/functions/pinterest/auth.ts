import { Handler } from '@netlify/functions';
import fetch from 'node-fetch';
import { PINTEREST_API_URL, validateConfig } from './config';

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  try {
    const { code, redirectUri, clientId, clientSecret } = JSON.parse(event.body || '{}');
    
    const config = validateConfig({ clientId, clientSecret, redirectUri });

    // Exchange code for token
    const tokenResponse = await fetch(`${PINTEREST_API_URL}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: config.redirectUri,
        client_id: config.clientId,
        client_secret: config.clientSecret,
      }).toString(),
    });

    const tokenData = await tokenResponse.json();
    
    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', tokenData);
      return {
        statusCode: tokenResponse.status,
        headers,
        body: JSON.stringify({ 
          error: tokenData.message || tokenData.error_description || 'Token exchange failed' 
        }),
      };
    }

    // Fetch user data
    const userResponse = await fetch(`${PINTEREST_API_URL}/user_account`, {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
      },
    });

    const userData = await userResponse.json();
    
    if (!userResponse.ok) {
      console.error('User data fetch failed:', userData);
      return {
        statusCode: userResponse.status,
        headers,
        body: JSON.stringify({ 
          error: userData.message || 'Failed to fetch user data' 
        }),
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        token: tokenData,
        user: userData,
      }),
    };
  } catch (error) {
    console.error('Pinterest API Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal server error',
      }),
    };
  }
};