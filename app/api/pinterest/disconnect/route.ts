import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/app/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    const sessionCookie = request.headers.get('cookie');
    if (!sessionCookie) {
      return NextResponse.json({ error: 'No session cookie' }, { status: 401 });
    }

    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie);
    const uid = decodedClaims.uid;

    await adminDb.ref(`users/${uid}/pinterest`).remove();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error disconnecting Pinterest account:', error);
    return NextResponse.json({ error: 'Failed to disconnect Pinterest account' }, { status: 500 });
  }
}

