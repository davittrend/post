import { env } from '@/lib/config/env';

export const PINTEREST_API_URL = 'https://api-sandbox.pinterest.com/v5';
export const REDIRECT_URI = typeof window !== 'undefined' ? `${window.location.origin}/callback` : '';
export const PINTEREST_SCOPE = 'boards:read,pins:read,pins:write,user_accounts:read,boards:write';

export const getPinterestConfig = () => ({
  clientId: env.VITE_PINTEREST_CLIENT_ID,
  clientSecret: env.VITE_PINTEREST_CLIENT_SECRET,
  redirectUri: REDIRECT_URI,
});