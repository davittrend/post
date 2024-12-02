const { adminAuth, adminDb } = require('../../lib/firebase-admin');
const fetch = require('node-fetch');

exports.handler = async (event, context) => {
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

    const userSnapshot = await adminDb.ref(`users/${uid}/pinterest`).once('value');
    const userData = userSnapshot.val();

    if (!userData || !userData.accessToken) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'User not connected to Pinterest' }),
      };
    }

    const response = await fetch('https://api.pinterest.com/v5/boards', {
      headers: {
        Authorization: `Bearer ${userData.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch boards');
    }

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({ boards: data.items }),
    };
  } catch (error) {
    console.error('Error fetching Pinterest boards:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch Pinterest boards' }),
    };
  }
};

