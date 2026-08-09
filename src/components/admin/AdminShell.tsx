'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Film,
  BarChart3,
  FileText,
  ExternalLink,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

type NavKey = 'dashboard' | 'movies' | 'analytics' | 'reports';

const OVERVIEW = [
  { key: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
  { key: 'movies' as const, label: 'Movies', icon: Film },
  { key: 'analytics' as const, label: 'Analytics', icon: BarChart3 },
  { key: 'reports' as const, label: 'Reports', icon: FileText },
];

export default function AdminShell({
  email,
  active,
  onNavigate,
  children,
}: {
  email?: string;
  active: NavKey;
  onNavigate: (key: NavKey) => void;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const signOut = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/login');
    router.refresh();
  };

  const Sidebar = (
    <aside className="flex h-full flex-col rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4 shadow-xl shadow-black/20">
      <div className="flex items-center gap-2.5 px-2 pb-6">
        <Image
          src="/uploads/logo.png"
          alt="Shakalaka"
          width={140}
          height={40}
          className="h-8 w-auto object-contain"
        />
      </div>

      <p className="px-3 mb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
        Overview
      </p>
      <nav className="space-y-1">
        {OVERVIEW.map(({ key, label, icon: Icon }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => {
                onNavigate(key);
                setMobileOpen(false);
              }}
              className={`relative w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[var(--color-brand)]/15 text-[var(--color-brand)]'
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              <Icon size={18} />
              {label}
              {isActive && (
                <span className="absolute right-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-l-full bg-[var(--color-brand)]" />
              )}
            </button>
          );
        })}
      </nav>

      <p className="px-3 mt-6 mb-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
        Account
      </p>
      <div className="space-y-1">
        <Link
          href="/"
          className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
        >
          <ExternalLink size={18} />
          View site
        </Link>
        <button
          type="button"
          onClick={signOut}
          className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
        >
          <LogOut size={18} />
          Log out
        </button>
      </div>

      <div className="mt-auto pt-6 px-2">
        {email && (
          <p className="text-xs text-zinc-500 truncate mb-2" title={email}>
            {email}
          </p>
        )}
        <p className="text-[10px] text-zinc-600">© Shakalaka Movie Admin</p>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-4 h-14">
        <Image
          src="/uploads/logo.png"
          alt="Shakalaka"
          width={120}
          height={32}
          className="h-7 w-auto object-contain"
        />
        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          className="rounded-lg border border-zinc-700 p-2 text-zinc-300"
          aria-label="Menu"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black/60 p-3 pt-16" onClick={() => setMobileOpen(false)}>
          <div className="h-[calc(100%-0.5rem)]" onClick={(e) => e.stopPropagation()}>
            {Sidebar}
          </div>
        </div>
      )}

      <div className="mx-auto max-w-[1440px] p-3 sm:p-5 lg:p-6">
        <div className="flex gap-5 lg:gap-6 min-h-[calc(100vh-2.5rem)]">
          <div className="hidden lg:block w-[240px] shrink-0 sticky top-6 h-[calc(100vh-3rem)]">
            {Sidebar}
          </div>
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
