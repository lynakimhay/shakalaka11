'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, LayoutDashboard, LogOut } from 'lucide-react';

export default function AdminHeader({ email }: { email?: string }) {
  const router = useRouter();

  const signOut = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.replace('/login');
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Image
            src="/uploads/logo.png"
            alt="Shakalaka"
            width={120}
            height={32}
            className="h-7 w-auto object-contain"
          />
          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-md bg-zinc-800 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-brand)]">
            <LayoutDashboard size={12} />
            Dashboard
          </span>
        </div>

        <div className="flex items-center gap-2">
          {email && (
            <span className="hidden md:inline text-xs text-zinc-500 truncate max-w-[180px]">
              {email}
            </span>
          )}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 px-2.5 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 transition-colors"
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">Site</span>
          </Link>
          <button
            type="button"
            onClick={signOut}
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 px-2.5 py-1.5 text-xs text-zinc-300 hover:bg-zinc-800 transition-colors"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Sign out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
