'use client';

import React, { useRef, useState } from 'react';
import { Movie } from '@/src/types';
import { Play, ChevronRight, ChevronLeft, Star } from 'lucide-react';
import MoviePlayer from './MoviePlayer';
import PosterImage from './PosterImage';

function RatingBadge() {
  return (
    <div className="absolute top-2 left-2 z-10 flex items-center gap-1 rounded-full bg-black/70 backdrop-blur-sm px-2.5 py-1 border border-white/10">
      <Star size={12} className="text-yellow-400 fill-yellow-400" />
      <span className="text-white text-xs font-bold">4.5</span>
    </div>
  );
}

function StatusBadge({ movie }: { movie: Movie }) {
  const premiumTypes = new Set(['Horror', 'Sci-Fi', 'Thriller']);
  const showPremium = premiumTypes.has(movie.type);

  if (showPremium) {
    return (
      <span className="absolute top-2 right-2 z-10 rounded px-2 py-0.5 text-[10px] font-bold tracking-wide bg-[var(--color-brand)] text-black">
        PREMIUM
      </span>
    );
  }

  return (
    <span className="absolute top-2 right-2 z-10 rounded px-2 py-0.5 text-[10px] font-bold tracking-wide bg-[var(--color-free)] text-white">
      FREE
    </span>
  );
}

export function PosterCard({
  movie,
  layout = 'portrait',
}: {
  movie: Movie;
  layout?: 'portrait' | 'landscape';
}) {
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const aspect = layout === 'portrait' ? 'aspect-[2/3]' : 'aspect-video';

  return (
    <>
      <button
        type="button"
        className="group w-full text-left"
        onClick={() => setIsPlayerOpen(true)}
      >
        <div
          className={`relative ${aspect} overflow-hidden rounded-xl bg-[#1a1a1a] ring-1 ring-white/5 transition-transform duration-300 group-hover:scale-[1.03] group-hover:ring-white/20`}
        >
          <PosterImage
            src={movie.posterUrl}
            poster={movie.poster}
            alt={movie.title}
          />
          <RatingBadge />
          <StatusBadge movie={movie} />
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/35 group-hover:opacity-100">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-black/70 border border-white/25 text-white shadow-lg">
              <Play size={20} fill="currentColor" className="ml-0.5" />
            </span>
          </div>
        </div>
        <h3 className="mt-2.5 text-sm font-medium text-white/90 line-clamp-2 group-hover:text-[var(--color-brand)] transition-colors">
          {movie.title}
        </h3>
        <p className="mt-0.5 text-xs text-white/45 truncate">
          {[movie.type, movie.year, movie.duration].filter(Boolean).join(' · ')}
        </p>
      </button>

      <MoviePlayer
        movie={movie}
        isOpen={isPlayerOpen}
        onClose={() => setIsPlayerOpen(false)}
      />
    </>
  );
}

interface MovieSectionProps {
  title: string;
  movies: Movie[];
  layout?: 'portrait' | 'landscape';
  mode?: 'row' | 'grid';
  onSeeAll?: () => void;
  showCount?: boolean;
}

export default function MovieSection({
  title,
  movies,
  layout = 'portrait',
  mode = 'row',
  onSeeAll,
  showCount = false,
}: MovieSectionProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 560), behavior: 'smooth' });
  };

  if (movies.length === 0) return null;

  if (mode === 'grid') {
    return (
      <section className="space-y-5">
        {showCount && (
          <p className="text-sm text-white/45">{movies.length} shown</p>
        )}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8">
          {movies.map((movie) => (
            <PosterCard key={movie.id} movie={movie} layout={layout} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4 group/section">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto">
        <div className="flex items-center gap-3 min-w-0">
          <span
            aria-hidden
            className="h-5 sm:h-6 w-1 shrink-0 rounded-full bg-gradient-to-b from-[#f0c94a] via-[var(--color-brand)] to-[#c4890a]"
          />
          <h2 className="text-lg sm:text-xl font-bold text-white truncate">{title}</h2>
        </div>
        {onSeeAll && (
          <button
            type="button"
            onClick={onSeeAll}
            className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--color-brand)] hover:text-[var(--color-brand-hover)] transition-colors shrink-0"
          >
            SEE ALL
            <ChevronRight size={16} />
          </button>
        )}
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          className="absolute left-1 top-[35%] z-10 hidden md:flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white opacity-0 group-hover/section:opacity-100 hover:bg-black/80 transition-opacity"
          aria-label="Scroll left"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          type="button"
          onClick={() => scrollBy(1)}
          className="absolute right-1 top-[35%] z-10 hidden md:flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white opacity-0 group-hover/section:opacity-100 hover:bg-black/80 transition-opacity"
          aria-label="Scroll right"
        >
          <ChevronRight size={20} />
        </button>

        <div
          ref={scrollerRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-8 pb-2 scroll-smooth"
        >
          {movies.map((movie) => (
            <div
              key={movie.id}
              className={
                layout === 'portrait'
                  ? 'w-[140px] sm:w-[168px] shrink-0'
                  : 'w-[240px] sm:w-[300px] shrink-0'
              }
            >
              <PosterCard movie={movie} layout={layout} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
