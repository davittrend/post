import fetch from 'node-fetch';
import { PINTEREST_API_URL } from '@/lib/pinterest/config';
import { createErrorResponse, createSuccessResponse } from '../utils';

export async function handleAuth(code: string, redirectUri: string, clientId: string, clientSecret: string) {
  try {
    const tokenResponse = await fetch(`${PINTEREST_API_URL}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }).toString(),
    });

    const tokenData = await tokenResponse.json();
    
    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', tokenData);
      return createErrorResponse(tokenResponse.status, tokenData.message || 'Token exchange failed');
    }

    const userResponse = await fetch(`${PINTEREST_API_URL}/user_account`, {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
      },
    });

    const userData = await userResponse.json();
    
    if (!userResponse.ok) {
      console.error('User data fetch failed:', userData);
      return createErrorResponse(userResponse.status, userData.message || 'Failed to fetch user data');
    }

    return createSuccessResponse({ token: tokenData, user: userData });
  } catch (error) {
    console.error('Auth handler error:', error);
    return createErrorResponse(500, error instanceof Error ? error.message : 'Internal server error');
  }
}