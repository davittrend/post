const { adminAuth, adminDb } = require('../../app/lib/firebase-admin');

const PINTEREST_TOKEN_URL = 'https://api.pinterest.com/v5/oauth/token';

exports.handler = async (event, context) => {
  const { code, state } = event.queryStringParameters;

  if (!state || !code) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid state or code' }),
    };
  }

  try {
    const sessionCookie = event.headers.cookie;
    if (!sessionCookie) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'No session cookie' }),
      };
    }

    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie);
    const uid = decodedClaims.uid;

    const tokenResponse = await fetch(PINTEREST_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: `${process.env.NEXT_PUBLIC_DOMAIN}/.netlify/functions/pinterest-callback`,
        client_id: process.env.NEXT_PUBLIC_PINTEREST_CLIENT_ID,
        client_secret: process.env.PINTEREST_CLIENT_SECRET,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error('Pinterest token exchange error:', errorData);
      return {
        statusCode: 403,
        body: JSON.stringify({ error: 'Failed to exchange code for token' }),
      };
    }

    const tokenData = await tokenResponse.json();

    await adminDb.ref(`users/${uid}/pinterest`).set({
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresAt: Date.now() + tokenData.expires_in * 1000,
    });

    return {
      statusCode: 302,
      headers: {
        Location: `${process.env.NEXT_PUBLIC_DOMAIN}/dashboard/accounts`,
      },
    };
  } catch (error) {
    console.error('Error in Pinterest callback:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to authenticate with Pinterest' }),
    };
  }
};

