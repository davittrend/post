export const PINTEREST_API_URL = 'https://api.pinterest.com/v5';
export const PINTEREST_OAUTH_URL = 'https://www.pinterest.com/oauth';

export interface PinterestConfig {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

export function validateConfig(config: Partial<PinterestConfig>): PinterestConfig {
  const { clientId, clientSecret, redirectUri } = config;

  if (!clientId) {
    throw new Error('Pinterest client ID is required');
  }
  if (!clientSecret) {
    throw new Error('Pinterest client secret is required');
  }
  if (!redirectUri) {
    throw new Error('Redirect URI is required');
  }

  return { clientId, clientSecret, redirectUri };
}