'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next') || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (!cancelled && res.ok) {
          router.replace(nextPath.startsWith('/') ? nextPath : '/admin');
        }
      } catch {
        // stay on login
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router, nextPath]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Invalid email or password');
        return;
      }

      router.replace(nextPath.startsWith('/') ? nextPath : '/admin');
      router.refresh();
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-10 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="/uploads/SHAKALAKA_WEAREOPEN_02.jpg"
          alt=""
          fill
          priority
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-black/75" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black" />
      </div>

      <div className="relative z-10 w-full max-w-[420px]">
        <div className="flex flex-col items-center text-center mb-8">
          <Image
            src="/uploads/logo.png"
            alt="Shakalaka Movie"
            width={180}
            height={56}
            className="h-12 w-auto object-contain mb-6"
            priority
          />
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-white/60">
            Admin login · Shakalaka Movie
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="sr-only">
              Email or phone number
            </label>
            <input
              id="email"
              type="text"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email or phone number"
              className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3.5 text-sm text-white placeholder:text-white/40 outline-none focus:border-[var(--color-brand)]/70 focus:ring-1 focus:ring-[var(--color-brand)]/40"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3.5 pr-12 text-sm text-white placeholder:text-white/40 outline-none focus:border-[var(--color-brand)]/70 focus:ring-1 focus:ring-[var(--color-brand)]/40"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/45 hover:text-white"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="mt-2 flex justify-end">
              <span className="text-xs text-[var(--color-brand)] cursor-default">
                Forgot password?
              </span>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-gradient-to-r from-[#e5a00d] to-[#f0c94a] py-3.5 text-sm font-bold text-black hover:brightness-105 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white/50">
          Admin accounts are invited only.{' '}
          <span className="text-[var(--color-brand)]">Contact site owner</span>
        </p>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-sm text-white/45 hover:text-white transition-colors"
          >
            Continue as guest
          </Link>
        </div>
      </div>
    </div>
  );
}
