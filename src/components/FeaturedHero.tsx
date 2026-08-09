'use client';

import React, { useEffect, useState } from 'react';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie } from '@/src/types';
import MoviePlayer from './MoviePlayer';
import PosterImage from './PosterImage';

interface FeaturedHeroProps {
  movies: Movie[];
}

export default function FeaturedHero({ movies }: FeaturedHeroProps) {
  const slides = movies.slice(0, 6);
  const [index, setIndex] = useState(0);
  const [playerOpen, setPlayerOpen] = useState(false);

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 6000);
    return () => clearInterval(id);
  }, [slides.length]);

  if (slides.length === 0) return null;

  const current = slides[index];

  const go = (dir: -1 | 1) => {
    setIndex((i) => (i + dir + slides.length) % slides.length);
  };

  return (
    <>
      <section className="relative w-full overflow-hidden bg-black">
        <div className="relative aspect-[16/10] sm:aspect-[21/9] max-h-[78vh] min-h-[320px] w-full">
          {slides.map((movie, i) => (
            <div
              key={movie.id}
              className={`absolute inset-0 transition-opacity duration-700 ${
                i === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              <PosterImage
                src={movie.posterUrl}
                poster={movie.poster}
                alt={movie.title}
                loading={i === 0 ? 'eager' : 'lazy'}
                className={`h-full w-full object-cover ${i === index ? 'hero-kenburns' : ''}`}
              />
            </div>
          ))}

          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

          <div className="absolute inset-0 flex items-end sm:items-center pb-10 sm:pb-0 pt-20">
            <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-10">
              <div className="max-w-xl animate-fade-up" key={current.id}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-brand)]">
                  Featured · {current.type}
                </p>
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight drop-shadow-lg">
                  {current.title}
                </h1>
                <p className="mt-3 text-sm sm:text-base text-white/75 max-w-md">
                  {[current.year, current.duration, current.subtitle]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
                <button
                  type="button"
                  onClick={() => setPlayerOpen(true)}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--color-brand)] px-7 py-3 text-sm sm:text-base font-bold text-black hover:bg-[var(--color-brand-hover)] transition-colors"
                >
                  <Play size={18} fill="currentColor" />
                  Watch Now
                </button>
              </div>
            </div>
          </div>

          {slides.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft size={22} />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                aria-label="Next"
              >
                <ChevronRight size={22} />
              </button>

              <div className="absolute bottom-5 left-4 sm:left-10 flex gap-1.5 z-10">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIndex(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === index ? 'w-7 bg-[var(--color-brand)]' : 'w-1.5 bg-white/40 hover:bg-white/70'
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <MoviePlayer
        movie={current}
        isOpen={playerOpen}
        onClose={() => setPlayerOpen(false)}
      />
    </>
  );
}
