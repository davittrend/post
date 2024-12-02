'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PinterestAuth } from '@/components/PinterestAuth'
import { withAuth } from '@/components/withAuth'
import { useAuthStore, usePinterestStore } from '@/lib/store'
import Loading from '@/components/Loading'
import { toast } from 'react-hot-toast'
import { ScheduledPins } from '@/components/ScheduledPins'

function Dashboard() {
  const { user, signOut, isLoading: authLoading } = useAuthStore()
  const { isConnected, boards, setIsConnected, setBoards } = usePinterestStore()
  const [isLoadingBoards, setIsLoadingBoards] = useState(false)

  useEffect(() => {
    const fetchPinterestData = async () => {
      try {
        setIsLoadingBoards(true)
        const response = await fetch('/api/pinterest/check-connection')
        const data = await response.json()
        setIsConnected(data.isConnected)

        if (data.isConnected) {
          const boardsResponse = await fetch('/api/pinterest/boards')
          const boardsData = await boardsResponse.json()
          setBoards(boardsData.boards)
        }
      } catch (error) {
        console.error('Error fetching Pinterest data:', error)
        toast.error('Failed to fetch Pinterest data. Please try again.')
      } finally {
        setIsLoadingBoards(false)
      }
    }

    if (user) {
      fetchPinterestData()
    }
  }, [user, setIsConnected, setBoards])

  if (authLoading || isLoadingBoards) {
    return <Loading />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Dashboard</h1>
      <p className="mb-4">Welcome, {user?.email}!</p>
      <div className="space-y-8">
        {!isConnected && <PinterestAuth />}
        {isConnected && (
          <>
            <div>
              <h2 className="text-2xl font-semibold mb-2">Your Pinterest Boards</h2>
              <ul className="space-y-2">
                {boards.map((board) => (
                  <li key={board.id} className="bg-gray-100 p-2 rounded">
                    {board.name}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-x-4">
              <Link href="/dashboard/schedule">
                <Button>Schedule New Pin</Button>
              </Link>
              <Link href="/dashboard/analytics">
                <Button>View Analytics</Button>
              </Link>
            </div>
            <ScheduledPins />
          </>
        )}
        <Button onClick={signOut}>Sign Out</Button>
      </div>
    </div>
  )
}

export default withAuth(Dashboard)

