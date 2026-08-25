'use client';

import { Suspense } from 'react';
import { Sparkles, ArrowRight, Zap } from 'lucide-react';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import { useRouter, useSearchParams } from 'next/navigation';

function AuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const mode = searchParams.get('mode') || 'login';
  const isLogin = mode === 'login';

  const switchMode = (newMode: 'login' | 'register') => {
    router.push(`/auth?mode=${newMode}`);
  };

  return (
    <div className="flex min-h-screen w-full bg-zinc-950 text-zinc-100">
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between border-r border-zinc-800/80 bg-gradient-to-br from-zinc-900 via-zinc-950 to-zinc-900 p-12">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="font-bold tracking-tight text-white text-lg">AI Expense Tracker</span>
        </div>

        <div className="max-w-md space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400">
            <Zap className="h-3.5 w-3.5" />
            <span>MVP</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white leading-tight">
            Track expenses smarter with AI intelligence.
          </h1>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Instantly add expenses, predict monthly budgets, and analyze spending habits seamlessly using modern web architecture.
          </p>
        </div>

        <div className="text-xs text-zinc-500">
          Built for learning Next.js, TypeScript, and Tailwind.
        </div>
      </div>

      <div className="flex w-full lg:w-1/2 flex-col justify-center items-center px-6 py-12 lg:px-16">
        <div className="w-full max-w-md space-y-6">
          <div className="flex lg:hidden items-center gap-2 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600/20 text-indigo-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-bold text-white">SpendAI</span>
          </div>

          {isLogin ? <LoginForm /> : <RegisterForm />}

          <div className="text-center text-sm text-zinc-400 pt-2">
            {isLogin ? (
              <p>
                Don&apos;t have an account?{' '}
                <button
                  onClick={() => switchMode('register')}
                  className="font-medium text-indigo-400 hover:underline inline-flex items-center gap-1"
                >
                  Sign up <ArrowRight className="h-3 w-3" />
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  onClick={() => switchMode('login')}
                  className="font-medium text-indigo-400 hover:underline inline-flex items-center gap-1"
                >
                  Sign in <ArrowRight className="h-3 w-3" />
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen w-full bg-zinc-950" />}>
      <AuthContent />
    </Suspense>
  );
}