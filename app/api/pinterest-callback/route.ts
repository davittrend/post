import { NextResponse } from 'next/server';
import { auth } from '@/lib/firebase';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const PINTEREST_TOKEN_URL = 'https://api.pinterest.com/v5/oauth/token';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');

  if (!code || !state) {
    return NextResponse.redirect('/error?message=Invalid authorization');
  }

  try {
    const response = await fetch(PINTEREST_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: `${process.env.NEXT_PUBLIC_DOMAIN}/api/pinterest-callback`,
        client_id: process.env.NEXT_PUBLIC_PINTEREST_CLIENT_ID!,
        client_secret: process.env.PINTEREST_CLIENT_SECRET!,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const data = await response.json();

    // Get the current user
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No authenticated user');
    }

    // Store the access token in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      pinterestAccessToken: data.access_token,
      pinterestRefreshToken: data.refresh_token,
      pinterestTokenExpiry: new Date(Date.now() + data.expires_in * 1000),
    }, { merge: true });

    return NextResponse.redirect('/dashboard');
  } catch (error) {
    console.error('Error in Pinterest callback:', error);
    return NextResponse.redirect('/error?message=Failed to authenticate with Pinterest');
  }
}

