import Link from 'next/link';
import { Button } from '@/components/ui/button';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-gray-800">Pin Poster</span>
              </div>
            </div>
            <div className="flex items-center">
              <Link href="/login">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link href="/signup">
                <Button>Sign up</Button>
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h1 className="text-4xl font-bold text-center mb-8">Welcome to Pin Poster</h1>
            <p className="text-xl text-center mb-8">
              Schedule and manage your Pinterest posts with ease. Boost your Pinterest presence with our powerful SaaS platform.
            </p>
            <div className="flex justify-center space-x-4">
              <SignIn />
              <SignUp />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

