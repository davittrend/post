import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/app/lib/firebase-admin';

const PINTEREST_TOKEN_URL = 'https://api.pinterest.com/v5/oauth/token';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  if (!state || !code) {
    return NextResponse.json({ error: 'Invalid state or code' }, { status: 400 });
  }

  try {
    const sessionCookie = request.headers.get('cookie');
    if (!sessionCookie) {
      return NextResponse.json({ error: 'No session cookie' }, { status: 401 });
    }

    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie);
    const uid = decodedClaims.uid;

    const tokenResponse = await fetch(PINTEREST_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: `${process.env.NEXT_PUBLIC_DOMAIN}/api/pinterest/callback`,
        client_id: process.env.NEXT_PUBLIC_PINTEREST_CLIENT_ID!,
        client_secret: process.env.PINTEREST_CLIENT_SECRET!,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error('Pinterest token exchange error:', errorData);
      return NextResponse.json({ error: 'Failed to exchange code for token' }, { status: 403 });
    }

    const tokenData = await tokenResponse.json();

    await adminDb.ref(`users/${uid}/pinterest`).set({
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresAt: Date.now() + tokenData.expires_in * 1000,
    });

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_DOMAIN}/dashboard/accounts`);
  } catch (error) {
    console.error('Error in Pinterest callback:', error);
    return NextResponse.json({ error: 'Failed to authenticate with Pinterest' }, { status: 500 });
  }
}

