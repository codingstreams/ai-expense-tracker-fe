'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const auth = useAuthStore((state) => state.auth);

  useEffect(() => {
    console.log("Auth "+ auth)
    if (!auth) {
      console.log('going to auth');
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
      <main className="p-8">
        <p className="text-zinc-400">Welcome to your protected AI expense tracker dashboard!</p>
      </main>
    </div>
  );
}