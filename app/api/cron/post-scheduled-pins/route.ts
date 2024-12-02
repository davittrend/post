import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, query, where, getDocs, updateDoc } from 'firebase/firestore'
import { getPinterestToken } from '@/lib/pinterest'

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const now = new Date()
    const scheduledPinsQuery = query(
      collection(db, 'scheduledPins'),
      where('status', '==', 'scheduled'),
      where('scheduledTime', '<=', now)
    )

    const scheduledPinsSnapshot = await getDocs(scheduledPinsQuery)

    for (const doc of scheduledPinsSnapshot.docs) {
      const pin = doc.data()
      const token = await getPinterestToken(pin.userId)

      try {
        const response = await fetch(`https://api.pinterest.com/v5/pins/${pin.pinId}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            board_id: pin.boardId,
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to post pin to Pinterest')
        }

        await updateDoc(doc.ref, {
          status: 'posted',
          postedAt: now,
        })
      } catch (error) {
        console.error(`Error posting pin ${pin.pinId}:`, error)
        await updateDoc(doc.ref, {
          status: 'failed',
          error: error.message,
        })
      }
    }

    return NextResponse.json({ success: true, message: 'Scheduled pins processed' })
  } catch (error) {
    console.error('Error processing scheduled pins:', error)
    return NextResponse.json({ error: 'Failed to process scheduled pins' }, { status: 500 })
  }
}

