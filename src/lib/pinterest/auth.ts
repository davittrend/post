import { PINTEREST_API_URL, PINTEREST_SCOPE, getPinterestConfig } from './config';
import type { PinterestToken, PinterestUser } from '@/types/pinterest';

export function getPinterestAuthUrl(): string {
  const { clientId, redirectUri } = getPinterestConfig();
  const state = crypto.randomUUID();
  return `${PINTEREST_API_URL}/oauth/?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${PINTEREST_SCOPE}&state=${state}`;
}

export async function exchangePinterestCode(code: string): Promise<{ token: PinterestToken; user: PinterestUser }> {
  const config = getPinterestConfig();
  
  const response = await fetch('/.netlify/functions/pinterest/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      code,
      redirectUri: config.redirectUri,
      clientId: config.clientId,
      clientSecret: config.clientSecret
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to exchange Pinterest code');
  }

  return response.json();
}