import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

const db = admin.database();
const PINTEREST_TOKEN_URL = 'https://api.pinterest.com/v5/oauth/token';

export const refreshPinterestTokens = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
  const usersSnapshot = await db.ref('users').once('value');
  const users = usersSnapshot.val();

  for (const userId in users) {
    const pinterestData = users[userId].pinterest;
    if (pinterestData && pinterestData.expiresAt < Date.now() + 7 * 24 * 60 * 60 * 1000) {
      try {
        const response = await fetch(PINTEREST_TOKEN_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: pinterestData.refreshToken,
            client_id: process.env.PINTEREST_CLIENT_ID!,
            client_secret: process.env.PINTEREST_CLIENT_SECRET!,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to refresh token');
        }

        const tokenData = await response.json();

        await db.ref(`users/${userId}/pinterest`).set({
          accessToken: tokenData.access_token,
          refreshToken: tokenData.refresh_token,
          expiresAt: Date.now() + tokenData.expires_in * 1000,
        });

        console.log(`Refreshed token for user ${userId}`);
      } catch (error) {
        console.error(`Failed to refresh token for user ${userId}:`, error);
      }
    }
  }
});

