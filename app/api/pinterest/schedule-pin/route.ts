import { NextResponse } from 'next/server'
import { getPinterestToken } from '@/lib/pinterest'
import { auth, db } from '@/lib/firebase'
import { addDoc, collection } from 'firebase/firestore'

export async function POST(request: Request) {
  try {
    const token = await getPinterestToken()
    const { title, description, link, imageUrl, boardId, scheduledTime } = await request.json()

    // Create the pin on Pinterest
    const createPinResponse = await fetch('https://api.pinterest.com/v5/pins', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        board_id: boardId,
        title,
        description,
        link,
        media_source: {
          source_type: 'image_url',
          url: imageUrl,
        },
      }),
    })

    if (!createPinResponse.ok) {
      throw new Error('Failed to create pin on Pinterest')
    }

    const pinData = await createPinResponse.json()

    // Store the scheduled pin in Firestore
    const user = auth.currentUser
    if (!user) {
      throw new Error('User not authenticated')
    }

    await addDoc(collection(db, 'users', user.uid, 'scheduledPins'), {
      pinId: pinData.id,
      boardId,
      title,
      description,
      link,
      imageUrl,
      scheduledTime: new Date(scheduledTime),
      status: 'scheduled',
    })

    return NextResponse.json({ success: true, pinId: pinData.id })
  } catch (error) {
    console.error('Error scheduling pin:', error)
    return NextResponse.json({ error: 'Failed to schedule pin' }, { status: 500 })
  }
}

