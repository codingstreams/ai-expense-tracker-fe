'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { LogOut, Loader2 } from 'lucide-react';
import { useLogout } from '@/api/generated/auth-controller/auth-controller';
import { useQueryClient } from '@tanstack/react-query';

interface LogoutButtonProps {
  iconOnly?: boolean;
}

export default function LogoutButton({ iconOnly = false }: LogoutButtonProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const logoutStore = useAuthStore((state) => state.logout);
  const { mutate: logoutMutate, isPending } = useLogout();

  const handleLogout = () => {
    logoutMutate({}, {
      onSettled: () => {
        logoutStore();
        queryClient.clear();
        router.push('/auth?mode=login');
      },
    });
  };

  if (iconOnly) {
    return (
      <button
        onClick={handleLogout}
        disabled={isPending}
        title="Sign Out"
        className="flex h-11 w-11 items-center justify-center rounded-xl text-zinc-400 transition hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
      >
        {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <LogOut className="h-5 w-5" />}
      </button>
    );
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
    >
      {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
      <span>{isPending ? 'Signing Out...' : 'Sign Out'}</span>
    </button>
  );
}