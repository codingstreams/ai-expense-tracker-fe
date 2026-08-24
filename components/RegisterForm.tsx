'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '@/lib/validations/auth';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { Lock, Mail, User, Loader2 } from 'lucide-react';
import { z } from 'zod';
import { authService } from '@/services/auth.service';

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const { auth, user } = await authService.register(data);
      setAuth(auth, user);
      router.push('/dashboard');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">
      <div className="text-center">
        <h2 className="text-2xl font-bold tracking-tight text-white">Create an account</h2>
        <p className="mt-2 text-sm text-zinc-400">Join us and get started today</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400">
            Full Name
          </label>
          <div className="relative mt-2">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
              <User className="h-5 w-5" />
            </span>
            <input
              {...register('name')}
              type="text"
              placeholder="John Doe"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-3 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          {errors.name && (
            <p className="mt-1 text-xs text-red-400">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400">
            Email Address
          </label>
          <div className="relative mt-2">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
              <Mail className="h-5 w-5" />
            </span>
            <input
              {...register('email')}
              type="email"
              placeholder="name@example.com"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-3 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400">
            Password
          </label>
          <div className="relative mt-2">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">
              <Lock className="h-5 w-5" />
            </span>
            <input
              {...register('password')}
              type="password"
              placeholder="••••••••"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-3 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-zinc-900 disabled:opacity-50"
        >
          {isSubmitting ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : 'Sign Up'}
        </button>
      </form>
    </div>
  );
}