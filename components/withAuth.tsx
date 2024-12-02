import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithAuth(props: P) {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!user) {
        router.push('/login');
      }
    }, [user, router]);

    if (!user) {
      return null; // or a loading spinner
    }

    return <WrappedComponent {...props} />;
  };
}

