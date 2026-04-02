'use client';

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/src/components/Navbar";
import MovieSection from "@/src/components/MovieSection";
import Footer from "@/src/components/Footer";
import { MOVIE_TYPES } from "@/src/constants";

// ✅ FETCH FROM API
async function getMovies(search?: string, type?: string) {
  try {
    let url = "/api/movies";
    const params = new URLSearchParams();

    if (search) params.set("search", search);
    if (type) params.set("type", type);

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) throw new Error("Failed to fetch movies");

    return await res.json();
  } catch (error) {
    console.error("Error fetching movies:", error);
    return [];
  }
}

export default function HomeClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Initialize from URL params once
  const [search, setSearch] = useState<string>(searchParams.get("search") || "");
  const [typeFilter, setTypeFilter] = useState<string>(
    searchParams.get("type") || "All"
  );
  const [movies, setMovies] = useState<any[]>([]);
  const [visibleCount, setVisibleCount] = useState(8);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // ✅ FETCH DATA (Debounce)
  useEffect(() => {
    // Debounced fetch + sync URL (replace to avoid history spam)
    const delay = setTimeout(async () => {
      setIsLoading(true);
      const data = await getMovies(
        search,
        typeFilter === "All" ? undefined : typeFilter
      );

      setMovies(data);
      setVisibleCount(8);
      setIsLoading(false);

      // sync URL params without adding history entry
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (typeFilter !== "All") params.set("type", typeFilter);

      const queryString = params.toString();
      // Use replace so typing doesn't create many history entries
      router.replace(queryString ? `/?${queryString}` : "/");
    }, 400);

    return () => clearTimeout(delay);
  }, [search, typeFilter, router]);

  // ✅ SEARCH
  const handleSearch = (query: string) => {
    setIsSearching(true);
    setSearch(query);
    setTimeout(() => {
      setIsSearching(false);
    }, 500);
  };

  // ✅ FILTER
  const handleTypeFilter = (newType: string) => {
    setIsLoading(true);
    setTypeFilter(newType);
  };

  // ✅ LOAD MORE
  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 8);
      setIsLoadingMore(false);
    }, 300);
  };

  const visibleMovies = movies.slice(0, visibleCount);
  const hasMore = movies.length > visibleMovies.length;

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar onSearch={handleSearch} initialQuery={search} isSearching={isSearching} />

      <main className="p-4 max-w-[1400px] mx-auto">

        {/* FILTER */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-3">
            <h2 className="text-sm text-zinc-400">Filter by Type</h2>
            {isLoading && (
              <div className="w-4 h-4 border-2 border-[#e5a00d] border-t-transparent rounded-full animate-spin" />
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            {["All", ...MOVIE_TYPES].map((t) => (
              <button
                key={t}
                onClick={() => handleTypeFilter(t)}
                disabled={isLoading}
                className={`px-5 py-2 rounded-full border transition-all
                  ${
                    typeFilter === t
                      ? "bg-[#e5a00d] text-black"
                      : "bg-white/5 text-white hover:bg-white/10"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* LOADING SKELETON */}
        {isLoading && movies.length === 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-8">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] bg-zinc-800 rounded-2xl animate-pulse" />
            ))}
          </div>
        )}

        {/* EMPTY */}
        {!isLoading && movies.length === 0 && (
          <div className="text-center py-20 text-zinc-400">
            <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
              🎬
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Movies Found</h3>
            <p className="text-sm text-zinc-500">
              {search ? 'Try adjusting your search terms' : 'No movies available yet'}
            </p>
          </div>
        )}

        {/* MOVIES */}
        {!isLoading && movies.length > 0 && (
          <MovieSection
            title="Movies"
            movies={visibleMovies}
            type="video"
          />
        )}

        {/* LOAD MORE */}
        {hasMore && (
          <div className="flex justify-center mt-8">
            <button
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="px-6 py-3 bg-[#e5a00d] text-black rounded-xl font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
            >
              {isLoadingMore ? (
                <>
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Loading...
                </>
              ) : (
                'Load More'
              )}
            </button>
          </div>
        )}

        <Footer />
      </main>
    </div>
  );
}