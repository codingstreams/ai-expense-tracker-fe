"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation"; 
import { useAuthStore } from "@/store/useAuthStore";
import UserGreetings from "@/components/dashboard/UserGreetings";

export default function DashboardPage() {
  const router = useRouter();
  const state = useAuthStore.getState();
  const isOnboarded = state.auth?.onboarded;

  useEffect(() => {
    if (!isOnboarded) {
      router.replace('/onboarding');
    }
  }, [isOnboarded, router]);

  if (!isOnboarded) {
    return null; 
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <main className="p-8">
        <UserGreetings />
      </main>
    </div>
  );
}
