'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Receipt, PieChart, Settings, Sparkles } from 'lucide-react';
import LogoutButton from '@/components/auth/LogoutButton';
import Sidebar from '@/components/dashboard/Sidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}


export default function DashboardLayout({ children }: DashboardLayoutProps) {
  

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
      <Sidebar/>

      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}