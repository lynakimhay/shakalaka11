'use client';

import React, { useState, useEffect } from "react";
import { Search, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavbarProps {
  onSearch?: (query: string) => void; // make it optional
  initialQuery?: string;
  isSearching?: boolean;
}

const Navbar = ({ onSearch, initialQuery = "", isSearching }: NavbarProps) => {
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery);

  // If user types, call onSearch after a short debounce to avoid spamming
  useEffect(() => {
    if (!onSearch) return;

    const id = setTimeout(() => {
      onSearch(query.trim());
    }, 400);

    return () => clearTimeout(id);
  }, [query, onSearch]); // include onSearch in dependencies

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) onSearch(query.trim());
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/5">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 bg-[#e5a00d] rounded flex items-center justify-center text-black font-bold">
              S
            </div>
            <span className="text-2xl font-black tracking-tighter text-white">SHAKALAKA</span>
          </Link>

          <form onSubmit={handleSubmit} className="flex-1 max-w-md mx-8 hidden sm:block">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input
                type="text"
                placeholder="Search movies..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-white/10 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-white placeholder:text-zinc-500 focus:outline-none"
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-[#e5a00d] border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
          </form>

          <Link
            href="/admin"
            className={`p-2 rounded-full hover:bg-white/10 transition-colors ${
              pathname === "/admin" ? "text-[#e5a00d]" : "text-zinc-400"
            }`}
          >
            <LayoutDashboard size={20} />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;