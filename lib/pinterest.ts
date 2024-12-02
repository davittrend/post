import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'

export async function getPinterestToken(userId: string) {
  const userDoc = await getDoc(doc(db, 'users', userId))
  const userData = userDoc.data()

  if (!userData || !userData.pinterestAccessToken) {
    throw new Error('No Pinterest access token found')
  }

  if (new Date() > userData.pinterestTokenExpiry.toDate()) {
    // Token has expired, refresh it
    const response = await fetch('/api/pinterest/refresh-token', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    })
    if (!response.ok) {
      throw new Error('Failed to refresh Pinterest token')
    }
    // Fetch the updated user data
    const updatedUserDoc = await getDoc(doc(db, 'users', userId))
    const updatedUserData = updatedUserDoc.data()
    return updatedUserData?.pinterestAccessToken
  }

  return userData.pinterestAccessToken
}

