'use client';

import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { MOVIE_TYPES } from '@/src/constants';

interface NavbarProps {
  onSearch?: (query: string) => void;
  initialQuery?: string;
  isSearching?: boolean;
  activeNav?: string;
  onNavChange?: (nav: string) => void;
  overHero?: boolean;
}

const NAV_ITEMS = ['Home', 'Movies', ...MOVIE_TYPES.slice(0, 4)];

const navItemClass = (isActive: boolean) =>
  `px-3.5 lg:px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
    isActive
      ? 'bg-[var(--color-brand)] text-black font-semibold'
      : 'text-white hover:bg-white/15'
  }`;

/** Match category pill height (text-sm + py-1.5). */
const utilityBtnClass =
  'inline-flex items-center justify-center gap-2 rounded-full bg-[#1c1510]/80 backdrop-blur-md border border-white/10 px-3.5 lg:px-4 py-1.5 text-sm font-medium text-white hover:bg-[#2a2018]/90 transition-colors min-h-[36px]';

const Navbar = ({
  activeNav = 'Home',
  onNavChange,
  overHero = false,
}: NavbarProps) => {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  const solidBar = !overHero || scrolled || menuOpen;

  const selectNav = (item: string) => {
    onNavChange?.(item);
    setMenuOpen(false);
  };

  const renderDesktopNavItems = () =>
    NAV_ITEMS.map((item) => {
      const isActive = pathname === '/' && activeNav === item;
      const className = navItemClass(isActive);

      if (onNavChange) {
        return (
          <button
            key={item}
            type="button"
            onClick={() => selectNav(item)}
            className={className}
          >
            {item}
          </button>
        );
      }

      return (
        <Link key={item} href="/" className={className} onClick={() => setMenuOpen(false)}>
          {item}
        </Link>
      );
    });

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        solidBar ? 'bg-black/90 backdrop-blur-md shadow-lg shadow-black/30' : 'bg-transparent'
      }`}
    >
      <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-[64px] sm:h-[76px] items-center justify-between gap-3">
          <Link
            href="/"
            className="shrink-0 flex items-center min-w-0"
            onClick={() => selectNav('Home')}
          >
            <Image
              src="/uploads/logo.png"
              alt="Shakalaka Movie"
              width={220}
              height={64}
              className="h-10 sm:h-12 md:h-14 w-auto max-w-[55vw] object-contain drop-shadow-md"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-2 min-w-0">
            <div className="flex items-center gap-0.5 rounded-full bg-[#1c1510]/80 backdrop-blur-md px-1.5 py-1 border border-white/10 overflow-x-auto scrollbar-hide max-w-[min(100%,520px)] min-h-[44px]">
              {renderDesktopNavItems()}
            </div>

            {/* Same pill style/size as left menu — stays on the right */}
            <div className="flex items-center rounded-full bg-[#1c1510]/80 backdrop-blur-md px-1.5 py-1 border border-white/10 min-h-[44px] shrink-0">
              <Link
                href="/admin"
                className={`inline-flex items-center gap-1.5 ${navItemClass(pathname === '/admin')}`}
              >
                <LayoutDashboard
                  size={14}
                  className={pathname === '/admin' ? 'text-black' : 'text-[var(--color-brand)]'}
                />
                Admin Panel
              </Link>
            </div>
          </div>

          {/* Mobile actions */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/admin"
              className="flex items-center rounded-full bg-[#1c1510]/80 backdrop-blur-md px-1.5 py-1 border border-white/10 min-h-[40px]"
              aria-label="Admin Panel"
            >
              <span className={`inline-flex items-center justify-center h-8 w-8 rounded-full ${pathname === '/admin' ? 'bg-[var(--color-brand)]' : ''}`}>
                <LayoutDashboard
                  size={16}
                  className={pathname === '/admin' ? 'text-black' : 'text-[var(--color-brand)]'}
                />
              </span>
            </Link>
            <button
              type="button"
              className={`${utilityBtnClass} h-10 w-10 !px-0`}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      {menuOpen && (
        <div className="md:hidden border-t border-white/10 bg-black/95 backdrop-blur-md">
          <div className="max-w-[1440px] mx-auto px-4 py-4 space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === '/' && activeNav === item;
              if (onNavChange) {
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => selectNav(item)}
                    className={`w-full text-left rounded-full px-4 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-[var(--color-brand)] text-black'
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    {item}
                  </button>
                );
              }
              return (
                <Link
                  key={item}
                  href="/"
                  onClick={() => setMenuOpen(false)}
                  className={`block w-full rounded-full px-4 py-3 text-sm font-medium ${
                    isActive
                      ? 'bg-[var(--color-brand)] text-black'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  {item}
                </Link>
              );
            })}

            <div className="pt-3 mt-2 border-t border-white/10">
              <div className="rounded-full bg-[#1c1510]/80 border border-white/10 p-1">
                <Link
                  href="/admin"
                  onClick={() => setMenuOpen(false)}
                  className={`w-full inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
                    pathname === '/admin'
                      ? 'bg-[var(--color-brand)] text-black'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <LayoutDashboard
                    size={16}
                    className={pathname === '/admin' ? 'text-black' : 'text-[var(--color-brand)]'}
                  />
                  Admin Panel
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
