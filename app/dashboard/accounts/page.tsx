import { cookies } from 'next/headers';
import { adminAuth, adminDb } from '@/app/lib/firebase-admin';
import AccountsClient from './accounts-client';

async function getServerSideProps() {
  const sessionCookie = cookies().get('session')?.value;
  
  if (!sessionCookie) {
    return { isConnected: false, boards: [] };
  }

  try {
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie);
    const uid = decodedClaims.uid;

    const snapshot = await adminDb.ref(`users/${uid}/pinterest`).once('value');
    const pinterestData = snapshot.val();

    if (!pinterestData || !pinterestData.accessToken) {
      return { isConnected: false, boards: [] };
    }

    // Fetch boards using the access token
    const boardsResponse = await fetch('https://api.pinterest.com/v5/boards', {
      headers: {
        Authorization: `Bearer ${pinterestData.accessToken}`,
      },
    });

    if (!boardsResponse.ok) {
      throw new Error('Failed to fetch boards');
    }

    const boardsData = await boardsResponse.json();

    return { isConnected: true, boards: boardsData.items };
  } catch (error) {
    console.error('Error fetching Pinterest data:', error);
    return { isConnected: false, boards: [] };
  }
}

export default async function AccountsPage() {
  const { isConnected, boards } = await getServerSideProps();

  return <AccountsClient initialIsConnected={isConnected} initialBoards={boards} />;
}

