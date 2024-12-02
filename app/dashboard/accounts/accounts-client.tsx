'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import PinterestAuth from '@/app/components/PinterestAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Board {
  id: string;
  name: string;
}

interface AccountsClientProps {
  initialIsConnected: boolean;
  initialBoards: Board[];
}

export default function AccountsClient({ initialIsConnected, initialBoards }: AccountsClientProps) {
  const [isConnected, setIsConnected] = useState(initialIsConnected);
  const [boards, setBoards] = useState(initialBoards);
  const router = useRouter();

  const handleDisconnect = async () => {
    try {
      const response = await fetch('/api/pinterest/disconnect', { method: 'POST' });
      if (response.ok) {
        setIsConnected(false);
        setBoards([]);
        router.refresh();
        toast.success('Pinterest account disconnected successfully');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to disconnect Pinterest account');
      }
    } catch (error) {
      console.error('Error disconnecting Pinterest account:', error);
      toast.error('Failed to disconnect Pinterest account. Please try again.');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Pinterest Accounts</h1>
      {!isConnected ? (
        <PinterestAuth onSuccess={() => {
          setIsConnected(true);
          toast.success('Pinterest account connected successfully');
        }} />
      ) : (
        <div>
          <p className="mb-4">Connected to Pinterest</p>
          <Button onClick={handleDisconnect} variant="destructive" className="mb-4">
            Disconnect Pinterest Account
          </Button>
          <h2 className="text-xl font-semibold mb-2">Your Boards</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {boards.map((board) => (
              <Card key={board.id}>
                <CardHeader>
                  <CardTitle>{board.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Board ID: {board.id}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

