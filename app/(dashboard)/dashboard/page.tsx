// app/(dashboard)/dashboard/page.tsx
'use client';

import { useAuthStore } from '@/store/useAuthStore';
import LogoutButton from '@/components/LogoutButton';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { auth, user } = useAuthStore();

  useEffect(() => {
    if (!auth) {
      router.replace('/auth?mode=login');
    }
  }, [auth, router]);

  if (!auth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-400">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="flex items-center justify-between border-b border-zinc-800 px-8 py-4">
        <h1 className="text-lg font-bold text-white">SpendAI Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-zinc-400">Hello, {user?.name || 'User'}</span>
          <LogoutButton />
        </div>
      </header>
      <main className="p-8">
        <p className="text-zinc-400">Welcome to your protected AI expense tracker dashboard!</p>
      </main>
    </div>
  );
}