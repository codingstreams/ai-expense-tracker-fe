'use client';

import { useAuthStore } from "@/store/useAuthStore";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RootPage() {
  const router = useRouter();
  const auth = useAuthStore((state) => state.auth);

  useEffect(() => {
    if (auth) {
      console.log('going to dashboard');
      router.replace('/dashboard');
    } else {
      console.log('going to auth');
      router.replace('/auth?mode=login');
    }
  }, [auth, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-400">
      <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
    </div>
  );
}