import { Handler } from '@netlify/functions';

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

export const handleOptions: Handler = async () => ({
  statusCode: 204,
  headers: corsHeaders,
  body: '',
});

export const createErrorResponse = (statusCode: number, error: string) => ({
  statusCode,
  headers: corsHeaders,
  body: JSON.stringify({ error }),
});

export const createSuccessResponse = (data: unknown) => ({
  statusCode: 200,
  headers: corsHeaders,
  body: JSON.stringify(data),
});