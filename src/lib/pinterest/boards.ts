import type { PinterestBoard } from '@/types/pinterest';

export async function fetchPinterestBoards(accessToken: string): Promise<PinterestBoard[]> {
  const response = await fetch('/.netlify/functions/pinterest/boards', {
    headers: { 
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch boards');
  }

  const data = await response.json();
  return data.items || [];
}