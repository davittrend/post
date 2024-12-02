import { NextResponse } from 'next/server';
import { adminDb } from '@/app/lib/firebase-admin';

const PINTEREST_TOKEN_URL = 'https://api.pinterest.com/v5/oauth/token';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET_KEY}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const usersSnapshot = await adminDb.ref('users').once('value');
    const users = usersSnapshot.val();

    if (!users) {
      return NextResponse.json({ message: 'No users found' }, { status: 200 });
    }

    for (const userId in users) {
      const user = users[userId];
      const pinterestData = user.pinterest;
      if (pinterestData && pinterestData.refreshToken && pinterestData.expiresAt < Date.now() + 7 * 24 * 60 * 60 * 1000) {
        try {
          const response = await fetch(PINTEREST_TOKEN_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              grant_type: 'refresh_token',
              refresh_token: pinterestData.refreshToken,
              client_id: process.env.NEXT_PUBLIC_PINTEREST_CLIENT_ID!,
              client_secret: process.env.PINTEREST_CLIENT_SECRET!,
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to refresh token');
          }

          const tokenData = await response.json();

          await adminDb.ref(`users/${userId}/pinterest`).set({
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

    return NextResponse.json({ success: true, message: 'Pinterest tokens refreshed' });
  } catch (error) {
    console.error('Error in cron job:', error);
    return NextResponse.json({ error: 'Failed to refresh Pinterest tokens' }, { status: 500 });
  }
}

