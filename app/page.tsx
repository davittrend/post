import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/store';

export default function Home() {
  const { user } = useAuthStore();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Welcome to Pin Poster</h1>
      <p className="mb-4">Manage and schedule your Pinterest posts with ease.</p>
      {user ? (
        <Link href="/dashboard">
          <Button>Go to Dashboard</Button>
        </Link>
      ) : (
        <div>
          <Link href="/login">
            <Button className="mr-4">Log In</Button>
          </Link>
          <Link href="/signup">
            <Button>Sign Up</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

