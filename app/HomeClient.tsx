'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import Navbar from '@/src/components/Navbar';
import MovieSection from '@/src/components/MovieSection';
import FeaturedHero from '@/src/components/FeaturedHero';
import Footer from '@/src/components/Footer';
import {
  MovieGridSkeleton,
  HomeSectionsSkeleton,
} from '@/src/components/MovieCardSkeleton';
import { MOVIE_TYPES } from '@/src/constants';
import { Movie } from '@/src/types';

const HOME_LATEST_LIMIT = 10;
const HOME_SECTION_LIMIT = 14;

type HomeSection = { title: string; movies: Movie[] };

async function getMovies(
  search?: string,
  type?: string,
  limit?: number
): Promise<Movie[]> {
  try {
    let url = '/api/movies';
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (type) params.set('type', type);
    if (limit && limit > 0) params.set('limit', String(limit));
    if (params.toString()) url += `?${params.toString()}`;

    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch movies');
    return await res.json();
  } catch (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
}

/** Latest (10) + each genre (14) in parallel — fills rows without loading the full catalog. */
async function getHomeFeed(): Promise<{ heroMovies: Movie[]; sections: HomeSection[] }> {
  const [latest, ...genreLists] = await Promise.all([
    getMovies(undefined, undefined, HOME_LATEST_LIMIT),
    ...MOVIE_TYPES.map((type) => getMovies(undefined, type, HOME_SECTION_LIMIT)),
  ]);

  const sections: HomeSection[] = [
    { title: 'Latest', movies: latest },
    ...MOVIE_TYPES.map((type, i) => ({
      title: type,
      movies: genreLists[i] || [],
    })).filter((s) => s.movies.length > 0),
  ];

  return { heroMovies: latest, sections };
}

export default function HomeClient() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [activeNav, setActiveNav] = useState('Home');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [homeSections, setHomeSections] = useState<HomeSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  const typeFilter =
    activeNav === 'Home' || activeNav === 'Movies' ? undefined : activeNav;

  const isHomeFeed = activeNav === 'Home' && !search.trim();
  const showBrowseGrid = !isHomeFeed;
  const showHomeHero = isHomeFeed && !isLoading && movies.length > 0;

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setIsLoading(true);

      if (isHomeFeed) {
        const { heroMovies, sections } = await getHomeFeed();
        if (cancelled) return;
        setMovies(heroMovies);
        setHomeSections(sections);
      } else {
        const data = await getMovies(search || undefined, typeFilter);
        if (cancelled) return;
        setMovies(data);
        setHomeSections([]);
      }

      setIsLoading(false);
      setIsSearching(false);
    };

    const delay = setTimeout(load, search ? 350 : 0);
    return () => {
      cancelled = true;
      clearTimeout(delay);
    };
  }, [search, typeFilter, isHomeFeed]);

  const handleNavChange = (nav: string) => {
    if (nav === activeNav && !search) return;
    setIsLoading(true);
    setMovies([]);
    setHomeSections([]);
    setActiveNav(nav);
    if (nav === 'Home') {
      setSearch('');
      setSearchInput('');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setIsLoading(true);
    setMovies([]);
    setHomeSections([]);
    setSearch(searchInput.trim());
    if (searchInput.trim() && activeNav === 'Home') {
      setActiveNav('Movies');
    }
  };

  useEffect(() => {
    const id = setTimeout(() => {
      if (searchInput.trim() !== search) {
        setIsSearching(true);
        setIsLoading(true);
        setMovies([]);
        setHomeSections([]);
        setSearch(searchInput.trim());
        if (searchInput.trim() && activeNav === 'Home') {
          setActiveNav('Movies');
        }
      }
    }, 400);
    return () => clearTimeout(id);
  }, [searchInput]); // eslint-disable-line react-hooks/exhaustive-deps

  const pageTitle =
    search.trim()
      ? `Results for “${search.trim()}”`
      : activeNav === 'Movies'
        ? 'Movies'
        : activeNav;

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar
        activeNav={activeNav}
        onNavChange={handleNavChange}
        isSearching={isSearching}
        overHero={showHomeHero}
      />

      {showHomeHero ? (
        <FeaturedHero movies={movies} />
      ) : (
        <div className="h-[64px] sm:h-[76px]" aria-hidden />
      )}

      <main className={showBrowseGrid ? 'pt-2' : undefined}>
        {showBrowseGrid && (
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="h-7 sm:h-8 w-1 shrink-0 rounded-full bg-gradient-to-b from-[#f0c94a] via-[var(--color-brand)] to-[#c4890a]"
                  />
                  <h1 className="text-3xl sm:text-4xl font-bold text-white">{pageTitle}</h1>
                </div>
                {isLoading ? (
                  <div className="mt-2 ml-5 h-4 w-20 rounded bg-[#1a1a1a] animate-pulse" />
                ) : (
                  <p className="mt-1 ml-5 text-sm text-white/45">{movies.length} shown</p>
                )}
              </div>
              <form onSubmit={handleSearchSubmit} className="w-full sm:max-w-sm">
                <div className="relative">
                  <Search
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40"
                    size={18}
                  />
                  <input
                    type="search"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search titles..."
                    className="w-full rounded-full bg-[#1c1c1c] border border-white/10 py-2.5 pl-11 pr-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[var(--color-brand)]/50"
                  />
                </div>
              </form>
            </div>
          </div>
        )}

        {!showBrowseGrid && !isLoading && (
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <form onSubmit={handleSearchSubmit} className="max-w-md ml-auto">
              <div className="relative">
                <Search
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40"
                  size={18}
                />
                <input
                  type="search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search titles..."
                  className="w-full rounded-full bg-[#1c1c1c] border border-white/10 py-2.5 pl-11 pr-4 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-[var(--color-brand)]/50"
                />
              </div>
            </form>
          </div>
        )}

        <div className="pb-10 space-y-10">
          {isLoading && showBrowseGrid && <MovieGridSkeleton count={10} />}
          {isLoading && !showBrowseGrid && <HomeSectionsSkeleton />}

          {!isLoading && movies.length === 0 && homeSections.length === 0 && (
            <div className="text-center py-24 text-white/50">
              <h3 className="text-xl font-bold text-white mb-2">No Movies Found</h3>
              <p className="text-sm">
                {search ? 'Try adjusting your search terms' : 'No movies available yet'}
              </p>
            </div>
          )}

          {!isLoading && movies.length > 0 && showBrowseGrid && (
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
              <MovieSection
                title={pageTitle}
                movies={movies}
                mode="grid"
                layout="portrait"
                showCount={false}
              />
            </div>
          )}

          {!isLoading && !showBrowseGrid && homeSections.length > 0 && (
            <>
              {homeSections.map((section) => (
                <MovieSection
                  key={section.title}
                  title={section.title}
                  movies={section.movies}
                  layout={section.title === 'Latest' ? 'landscape' : 'portrait'}
                  mode="row"
                  onSeeAll={() =>
                    handleNavChange(section.title === 'Latest' ? 'Movies' : section.title)
                  }
                />
              ))}
            </>
          )}
        </div>

        <Footer />
      </main>
    </div>
  );
}
