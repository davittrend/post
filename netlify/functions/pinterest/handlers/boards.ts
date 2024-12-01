import fetch from 'node-fetch';
import { PINTEREST_API_URL } from '@/lib/pinterest/config';
import { createErrorResponse, createSuccessResponse } from '../utils';

export async function handleBoards(accessToken: string) {
  try {
    const response = await fetch(`${PINTEREST_API_URL}/boards`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json',
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('Pinterest API Error:', data);
      return createErrorResponse(response.status, data.message || 'Failed to fetch boards');
    }

    return createSuccessResponse(data);
  } catch (error) {
    console.error('Boards handler error:', error);
    return createErrorResponse(500, error instanceof Error ? error.message : 'Internal server error');
  }
}