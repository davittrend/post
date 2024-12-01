import { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAccountStore } from '@/lib/store';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { initializeStore, resetStore } = useAccountStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      
      if (currentUser) {
        initializeStore(currentUser.uid);
      } else {
        resetStore();
      }
    });

    return () => unsubscribe();
  }, [initializeStore, resetStore]);

  return { user, loading };
}