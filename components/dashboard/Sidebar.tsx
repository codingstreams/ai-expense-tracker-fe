import Link from "next/link";
import LogoutButton from "../auth/LogoutButton";
import { LayoutDashboard, Receipt, PieChart, Settings, Sparkles } from 'lucide-react';
import { usePathname } from "next/navigation";

const navItems = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Transactions', href: '/dashboard/transactions', icon: Receipt },
  { name: 'Analytics', href: '/dashboard/analytics', icon: PieChart },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];


export default function Sidebar(){
  const pathname = usePathname();
  
  return (
    <aside className="flex w-16 flex-col items-center justify-between border-r border-zinc-800 bg-zinc-900/50 py-8 backdrop-blur-md">
        <div className="flex flex-col items-center gap-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
            <Sparkles className="h-5 w-5" />
          </div>

          <nav className="flex flex-col gap-3">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  title={item.name}
                  className={`flex h-11 w-11 items-center justify-center rounded-xl transition ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                      : 'text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-200'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </Link>
              );
            })}
          </nav>
        </div>

        <div>
          <LogoutButton iconOnly/>
        </div>
      </aside>
  );
}