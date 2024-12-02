'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-gray-800">Pin Poster</span>
              </div>
            </div>
            <div className="flex items-center">
              <span className="mr-4">{user.email}</span>
              <Button onClick={() => router.push('/api/auth/signout')} variant="ghost">Log out</Button>
            </div>
          </div>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="w-64 bg-white shadow-md">
          <nav className="mt-5">
            <Link href="/dashboard" className="block py-2 px-4 text-gray-600 hover:bg-gray-200">
              Dashboard
            </Link>
            <Link href="/dashboard/accounts" className="block py-2 px-4 text-gray-600 hover:bg-gray-200">
              Accounts
            </Link>
            <Link href="/dashboard/scheduler" className="block py-2 px-4 text-gray-600 hover:bg-gray-200">
              Scheduler
            </Link>
            <Link href="/dashboard/scheduled-pins" className="block py-2 px-4 text-gray-600 hover:bg-gray-200">
              Scheduled Pins
            </Link>
          </nav>
        </aside>
        <main className="flex-1 p-10">
          {children}
        </main>
      </div>
    </div>
  );
}

