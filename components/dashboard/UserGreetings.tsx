'use client';

import { useAuthStore } from '@/store/useAuthStore';
import { useState, useEffect } from 'react';

export default function UserGreetings() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div>
        <h1 className="text-xl font-semibold">Hello!</h1>
        <p className="text-zinc-400">Welcome to your dashboard.</p>
      </div>
    );
  }

  const state = useAuthStore.getState();
  const name = state.user?.name || '';

  const currentHour = new Date().getHours();
  let timeGreeting = 'Hello';

  if (currentHour < 12) {
    timeGreeting = 'Good morning';
  } else if (currentHour < 18) {
    timeGreeting = 'Good afternoon';
  } else {
    timeGreeting = 'Good evening';
  }

  return (
    <div>
      <h1 className="text-xl font-semibold">
        {timeGreeting}{name ? `, ${name}` : ''}!
      </h1>
      <p className="text-zinc-400">Welcome to your dashboard.</p>
    </div>
  );
}