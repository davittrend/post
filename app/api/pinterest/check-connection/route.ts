import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const accessToken = cookies().get('pinterest_access_token')?.value;

  return NextResponse.json({ isConnected: !!accessToken });
}

