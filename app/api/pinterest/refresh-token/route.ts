import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'

const PINTEREST_TOKEN_URL = 'https://api.pinterest.com/v5/oauth/token'

export async function POST(request: Request) {
  try {
    const { userId } = await request.json()
    const userDoc = await getDoc(doc(db, 'users', userId))
    const userData = userDoc.data()

    if (!userData || !userData.pinterestRefreshToken) {
      return NextResponse.json({ error: 'No refresh token found' }, { status: 400 })
    }

    const response = await fetch(PINTEREST_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: userData.pinterestRefreshToken,
        client_id: process.env.NEXT_PUBLIC_PINTEREST_CLIENT_ID!,
        client_secret: process.env.PINTEREST_CLIENT_SECRET!,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to refresh token')
    }

    const data = await response.json()

    await setDoc(doc(db, 'users', userId), {
      pinterestAccessToken: data.access_token,
      pinterestRefreshToken: data.refresh_token,
      pinterestTokenExpiry: new Date(Date.now() + data.expires_in * 1000),
    }, { merge: true })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error refreshing Pinterest token:', error)
    return NextResponse.json({ error: 'Failed to refresh Pinterest token' }, { status: 500 })
  }
}

