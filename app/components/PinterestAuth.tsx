'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const PINTEREST_AUTH_URL = 'https://www.pinterest.com/oauth/';
const SCOPES = ['boards:read', 'pins:read', 'pins:write'];

interface PinterestAuthProps {
  onSuccess: () => void;
}

export default function PinterestAuth({ onSuccess }: PinterestAuthProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAuth = () => {
    setIsLoading(true);
    const redirectUri = `${process.env.NEXT_PUBLIC_DOMAIN}/.netlify/functions/pinterest-callback`;
    const state = Math.random().toString(36).substring(7);
    localStorage.setItem('pinterestAuthState', state);

    const authUrl = `${PINTEREST_AUTH_URL}?client_id=${process.env.NEXT_PUBLIC_PINTEREST_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${SCOPES.join(',')}&state=${state}`;
    
    router.push(authUrl);
  };

  return (
    <Button onClick={handleAuth} disabled={isLoading}>
      {isLoading ? 'Connecting...' : 'Connect Pinterest Account'}
    </Button>
  );
}

