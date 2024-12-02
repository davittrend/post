import { useEffect, useState } from 'react'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db, auth } from '@/lib/firebase'
import { ScheduledPin } from '@/types'
import { format } from 'date-fns'

export function ScheduledPins() {
  const [scheduledPins, setScheduledPins] = useState<ScheduledPin[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const user = auth.currentUser
    if (!user) return

    const q = query(collection(db, 'users', user.uid, 'scheduledPins'))
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const pins: ScheduledPin[] = []
      querySnapshot.forEach((doc) => {
        pins.push({ id: doc.id, ...doc.data() } as ScheduledPin)
      })
      setScheduledPins(pins)
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  if (isLoading) {
    return <div>Loading scheduled pins...</div>
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Scheduled Pins</h2>
      {scheduledPins.length === 0 ? (
        <p>No pins scheduled.</p>
      ) : (
        <ul className="space-y-4">
          {scheduledPins.map((pin) => (
            <li key={pin.id} className="bg-white shadow rounded-lg p-4">
              <h3 className="font-semibold">{pin.title}</h3>
              <p className="text-sm text-gray-600">{pin.description}</p>
              <p className="text-sm text-gray-500 mt-2">
                Scheduled for: {format(pin.scheduledTime.toDate(), 'PPpp')}
              </p>
              <p className={`text-sm mt-2 ${
                pin.status === 'posted' ? 'text-green-600' :
                pin.status === 'failed' ? 'text-red-600' :
                'text-yellow-600'
              }`}>
                Status: {pin.status}
              </p>
              {pin.status === 'failed' && pin.error && (
                <p className="text-sm text-red-600 mt-1">Error: {pin.error}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

