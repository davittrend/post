import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const PINTEREST_API_URL = 'https://api.pinterest.com/v5';

export async function GET() {
  const accessToken = cookies().get('pinterest_access_token')?.value;

  if (!accessToken) {
    return NextResponse.json({ error: 'Not authenticated with Pinterest' }, { status: 401 });
  }

  try {
    const response = await fetch(`${PINTEREST_API_URL}/boards`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch boards');
    }

    const data = await response.json();

    return NextResponse.json({ boards: data.items });
  } catch (error) {
    console.error('Error fetching Pinterest boards:', error);
    return NextResponse.json({ error: 'Failed to fetch Pinterest boards' }, { status: 500 });
  }
}

