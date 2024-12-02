import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuthStore } from '@/lib/store';

export function useAuth() {
  const { user, setUser, isLoading, setIsLoading, error, setError } = useAuthStore();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
      setIsLoading(false);
    }, (error) => {
      setError(error.message);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setIsLoading, setError]);

  return { user, isLoading, error };
}

