import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/app/lib/firebase-admin';

const PINTEREST_TOKEN_URL = 'https://api.pinterest.com/v5/oauth/token';

export async function POST(request: Request) {
  try {
    const sessionCookie = request.headers.get('cookie');
    if (!sessionCookie) {
      return NextResponse.json({ error: 'No session cookie' }, { status: 401 });
    }

    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie);
    const uid = decodedClaims.uid;

    const userRef = adminDb.ref(`users/${uid}/pinterest`);
    const snapshot = await userRef.once('value');
    const userData = snapshot.val();

    if (!userData || !userData.refreshToken) {
      return NextResponse.json({ error: 'No Pinterest data found' }, { status: 404 });
    }

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

    await userRef.set({
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresAt: Date.now() + tokenData.expires_in * 1000,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error refreshing Pinterest token:', error);
    return NextResponse.json({ error: 'Failed to refresh Pinterest token' }, { status: 500 });
  }
}

