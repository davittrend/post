import { db } from '@/app/lib/firebase';
import { ref, get, set } from 'firebase/database';

const PINTEREST_TOKEN_URL = 'https://api.pinterest.com/v5/oauth/token';

export async function refreshPinterestToken(userId: string) {
  const userRef = ref(db, `users/${userId}/pinterest`);
  const snapshot = await get(userRef);
  const userData = snapshot.val();

  if (!userData || !userData.refreshToken) {
    throw new Error('User not found or Pinterest refresh token not available');
  }

  try {
    const response = await fetch(PINTEREST_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: userData.refreshToken,
        client_id: process.env.NEXT_PUBLIC_PINTEREST_CLIENT_ID!,
        client_secret: process.env.PINTEREST_CLIENT_SECRET!,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to refresh token');
    }

    const tokenData = await response.json();

    await set(userRef, {
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresAt: Date.now() + tokenData.expires_in * 1000,
    });

    return tokenData.access_token;
  } catch (error) {
    console.error('Error refreshing Pinterest token:', error);
    throw error;
  }
}

