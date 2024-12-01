import { Handler } from '@netlify/functions';
import { handleOptions, corsHeaders, createErrorResponse } from './utils';
import { handleAuth } from './handlers/auth';
import { handleBoards } from './handlers/boards';

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return handleOptions(event);
  }

  try {
    const path = event.path.split('/').pop();

    switch (path) {
      case 'auth': {
        if (event.httpMethod !== 'POST') {
          return createErrorResponse(405, 'Method not allowed');
        }

        const { code, redirectUri, clientId, clientSecret } = JSON.parse(event.body || '{}');

        if (!code || !redirectUri || !clientId || !clientSecret) {
          return createErrorResponse(400, 'Missing required parameters');
        }

        return handleAuth(code, redirectUri, clientId, clientSecret);
      }

      case 'boards': {
        if (event.httpMethod !== 'GET') {
          return createErrorResponse(405, 'Method not allowed');
        }

        const accessToken = event.headers.authorization?.replace('Bearer ', '');
        if (!accessToken) {
          return createErrorResponse(401, 'No access token provided');
        }

        return handleBoards(accessToken);
      }

      default:
        return createErrorResponse(404, 'Not found');
    }
  } catch (error) {
    console.error('Pinterest API Error:', error);
    return createErrorResponse(
      500,
      error instanceof Error ? error.message : 'Internal server error'
    );
  }
};