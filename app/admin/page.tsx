'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'motion/react';
import {
  Plus,
  Trash2,
  Edit2,
  Film,
  Search,
  Calendar,
  Clock,
  ImageIcon,
  Video,
  RefreshCw,
  TrendingUp,
  List,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import AdminShell from '@/src/components/admin/AdminShell';
import MovieForm from '@/src/components/admin/MovieForm';
import PosterImage from '@/src/components/PosterImage';
import { MOVIE_TYPES } from '@/src/constants';
import { Movie } from '@/src/types';

type Toast = { type: 'success' | 'error'; message: string } | null;
type NavKey = 'dashboard' | 'movies' | 'analytics' | 'reports';

const PAGE_SIZE = 15;

type MovieStats = {
  total: number;
  withPoster: number;
  withVideo: number;
  missingPoster: number;
  posterPct: number;
  videoPct: number;
  byType: { type: string; count: number }[];
  maxType: number;
  topType: string;
  recent: Movie[];
};

const emptyStats: MovieStats = {
  total: 0,
  withPoster: 0,
  withVideo: 0,
  missingPoster: 0,
  posterPct: 0,
  videoPct: 0,
  byType: [],
  maxType: 1,
  topType: '—',
  recent: [],
};

export default function AdminPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [stats, setStats] = useState<MovieStats>(emptyStats);
  const [isLoading, setIsLoading] = useState(true);
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [viewMode, setViewMode] = useState<'list' | 'card'>('list');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [adminEmail, setAdminEmail] = useState<string>();
  const [toast, setToast] = useState<Toast>(null);
  const [nav, setNav] = useState<NavKey>('dashboard');

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 2800);
  };

  const fetchStats = useCallback(async () => {
    setIsStatsLoading(true);
    try {
      const res = await fetch('/api/movies/stats');
      if (!res.ok) throw new Error('Failed to fetch stats');
      setStats(await res.json());
    } catch (error: unknown) {
      showToast('error', error instanceof Error ? error.message : 'Failed to load stats');
    } finally {
      setIsStatsLoading(false);
    }
  }, []);

  const fetchMovies = useCallback(
    async (opts?: { silent?: boolean; page?: number }) => {
      const silent = opts?.silent ?? false;
      const pageToLoad = opts?.page ?? page;
      if (!silent) setIsLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(pageToLoad),
          limit: String(PAGE_SIZE),
        });
        if (typeFilter !== 'All') params.set('type', typeFilter);
        if (debouncedSearch.trim()) params.set('search', debouncedSearch.trim());

        const res = await fetch(`/api/movies?${params}`);
        if (!res.ok) throw new Error('Failed to fetch movies');
        const data = await res.json();
        setMovies(data.items ?? []);
        setTotal(data.total ?? 0);
        setTotalPages(data.totalPages ?? 1);
        setPage(data.page ?? pageToLoad);
      } catch (error: unknown) {
        showToast('error', error instanceof Error ? error.message : 'Failed to load');
      } finally {
        setIsLoading(false);
      }
    },
    [page, typeFilter, debouncedSearch]
  );

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  useEffect(() => {
    setPage(1);
  }, [typeFilter, debouncedSearch]);

  useEffect(() => {
    fetchMovies({ page });
  }, [page, typeFilter, debouncedSearch]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchStats();
    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.email) setAdminEmail(data.email);
      })
      .catch(() => {});
  }, [fetchStats]);

  const refreshAll = async (silent = false) => {
    await Promise.all([fetchMovies({ silent, page }), fetchStats()]);
  };

  const handleSubmitMovie = async (
    movieData: Omit<Movie, 'id'>,
    id?: string | number
  ) => {
    const url = id ? `/api/movies/${id}` : '/api/movies';
    const method = id ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(movieData),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to save movie');
    }
    await refreshAll(true);
    setIsFormOpen(false);
    setEditingMovie(null);
    showToast('success', id ? 'Movie updated' : 'Movie created');
    setNav('movies');
  };

  const handleDeleteMovie = async (id: string | number, title: string) => {
    if (!confirm(`Delete “${title}”? This cannot be undone.`)) return;
    setIsDeleting(id);
    try {
      const res = await fetch(`/api/movies/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to delete');
      }
      // If we deleted the last item on this page, go back a page.
      const nextPage = movies.length === 1 && page > 1 ? page - 1 : page;
      if (nextPage !== page) setPage(nextPage);
      else await fetchMovies({ silent: true, page: nextPage });
      await fetchStats();
      showToast('success', 'Movie deleted');
    } catch (error: unknown) {
      showToast('error', error instanceof Error ? error.message : 'Delete failed');
    } finally {
      setIsDeleting(null);
    }
  };

  const pageMeta: Record<NavKey, { title: string; subtitle: string }> = {
    dashboard: {
      title: 'Dashboard',
      subtitle: 'All details about your movie library are here.',
    },
    movies: {
      title: 'Movies',
      subtitle: 'Create, update, and delete titles cleanly.',
    },
    analytics: {
      title: 'Analytics',
      subtitle: 'Track genre mix and media coverage.',
    },
    reports: {
      title: 'Reports',
      subtitle: 'Quick health snapshot of posters and videos.',
    },
  };

  const showLibrary = nav === 'dashboard' || nav === 'movies';
  const showAnalytics = nav === 'dashboard' || nav === 'analytics' || nav === 'reports';

  const libraryMovies = nav === 'dashboard' ? stats.recent : movies;
  const libraryLoading = nav === 'dashboard' ? isStatsLoading : isLoading;
  const rangeFrom = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeTo = Math.min(page * PAGE_SIZE, total);
  const kpiLoading = isStatsLoading;

  const getMovieStatus = (movie: Movie) => {
    const hasPoster = Boolean(movie.posterUrl || movie.poster);
    const hasVideo = Boolean(movie.videoUrl);
    const status =
      hasPoster && hasVideo
        ? 'Ready'
        : hasVideo
          ? 'No poster'
          : hasPoster
            ? 'No video'
            : 'Incomplete';
    const statusClass =
      status === 'Ready'
        ? 'bg-emerald-950 text-emerald-300'
        : status === 'Incomplete'
          ? 'bg-red-950/60 text-red-300'
          : 'bg-amber-950/50 text-amber-300';
    return { status, statusClass, hasPoster, hasVideo };
  };

  return (
    <AdminShell email={adminEmail} active={nav} onNavigate={setNav}>
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 rounded-xl border px-4 py-2.5 text-sm shadow-lg ${
            toast.type === 'success'
              ? 'border-emerald-800 bg-emerald-950 text-emerald-200'
              : 'border-red-900 bg-red-950 text-red-200'
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="space-y-5">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {pageMeta[nav].title}
            </h1>
            <p className="mt-1 text-sm text-zinc-400">{pageMeta[nav].subtitle}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative min-w-[200px] flex-1 sm:flex-none sm:w-56">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
              />
              <input
                type="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search"
                className="w-full rounded-full border border-zinc-700 bg-zinc-900 pl-9 pr-3 py-2 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-[var(--color-brand)]/50"
              />
            </div>
            <button
              type="button"
              onClick={() => refreshAll()}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-700 text-zinc-300 hover:bg-zinc-900"
              aria-label="Refresh"
            >
              <RefreshCw
                size={15}
                className={isLoading || isStatsLoading ? 'animate-spin' : ''}
              />
            </button>
            <button
              type="button"
              onClick={() => {
                setEditingMovie(null);
                setIsFormOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-brand)] px-4 py-2 text-sm font-semibold text-black hover:bg-[var(--color-brand-hover)]"
            >
              <Plus size={16} />
              Add movie
            </button>
          </div>
        </div>

        {/* Summary strip (like green KPI bar, but gold) */}
        {(nav === 'dashboard' || nav === 'reports') && (
          <section className="rounded-2xl bg-gradient-to-r from-[#c4890a] via-[var(--color-brand)] to-[#f0c94a] p-1 shadow-lg shadow-[var(--color-brand)]/10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 rounded-[14px] overflow-hidden">
              {[
                {
                  label: 'Total movies',
                  value: kpiLoading ? '—' : stats.total.toLocaleString(),
                  change: stats.topType !== '—' ? `Top: ${stats.topType}` : 'No data yet',
                  icon: Film,
                },
                {
                  label: 'With video',
                  value: kpiLoading ? '—' : `${stats.videoPct}%`,
                  change: `${stats.withVideo} titles ready`,
                  icon: Video,
                },
                {
                  label: 'With poster',
                  value: kpiLoading ? '—' : `${stats.posterPct}%`,
                  change:
                    stats.missingPoster > 0
                      ? `${stats.missingPoster} missing`
                      : 'All covered',
                  icon: ImageIcon,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="bg-black/15 backdrop-blur-sm px-5 py-4 text-black"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium text-black/70">{item.label}</p>
                      <p className="mt-1 text-3xl font-bold tabular-nums tracking-tight">
                        {item.value}
                      </p>
                      <p className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-black/75">
                        <TrendingUp size={12} />
                        {item.change}
                      </p>
                    </div>
                    <span className="rounded-lg bg-black/10 p-2">
                      <item.icon size={18} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Analytics widgets */}
        {showAnalytics && (
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 shadow-lg shadow-black/10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-white">Genre coverage</h2>
                <span className="text-xs text-zinc-500">This library</span>
              </div>
              {isStatsLoading ? (
                <div className="h-48 animate-pulse rounded-xl bg-zinc-800" />
              ) : stats.byType.length === 0 ? (
                <p className="text-sm text-zinc-500 py-16 text-center">No genre data yet</p>
              ) : (
                <div className="space-y-3">
                  {stats.byType.map((item) => (
                    <button
                      key={item.type}
                      type="button"
                      onClick={() => {
                        setTypeFilter(item.type);
                        setPage(1);
                        setNav('movies');
                      }}
                      className="w-full text-left group"
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-zinc-300 group-hover:text-white">{item.type}</span>
                        <span className="tabular-nums text-zinc-500">{item.count}</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-zinc-800 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#c4890a] to-[var(--color-brand)]"
                          style={{ width: `${(item.count / stats.maxType) * 100}%` }}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 shadow-lg shadow-black/10">
              <h2 className="text-base font-semibold text-white mb-4">Media health</h2>
              <div className="flex flex-col items-center justify-center py-2">
                <div
                  className="relative h-36 w-36 rounded-full"
                  style={{
                    background: `conic-gradient(var(--color-brand) 0 ${stats.posterPct}%, #3f3f46 ${stats.posterPct}% ${stats.posterPct + Math.max(stats.videoPct - stats.posterPct, 0)}%, #27272a ${stats.posterPct}% 100%)`,
                  }}
                >
                  <div className="absolute inset-3 rounded-full bg-zinc-900 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-white tabular-nums">
                      {kpiLoading ? '—' : `${stats.posterPct}%`}
                    </span>
                    <span className="text-[11px] text-zinc-500">Posters</span>
                  </div>
                </div>
                <div className="mt-5 w-full space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-zinc-400">
                      <span className="h-2 w-2 rounded-full bg-[var(--color-brand)]" />
                      With poster
                    </span>
                    <span className="tabular-nums text-zinc-300">{stats.withPoster}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-zinc-400">
                      <span className="h-2 w-2 rounded-full bg-zinc-500" />
                      With video
                    </span>
                    <span className="tabular-nums text-zinc-300">{stats.withVideo}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-zinc-400">
                      <span className="h-2 w-2 rounded-full bg-zinc-700" />
                      Missing poster
                    </span>
                    <span className="tabular-nums text-zinc-300">{stats.missingPoster}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Library table */}
        {showLibrary && (
          <section className="rounded-2xl border border-zinc-800 bg-zinc-900/70 shadow-lg shadow-black/10 overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 py-4 border-b border-zinc-800">
              <h2 className="text-base font-semibold text-white">
                {nav === 'dashboard' ? 'Recent movies' : 'Movie library'}
              </h2>
              <div className="flex items-center gap-2">
                <select
                  value={typeFilter}
                  onChange={(e) => {
                    setTypeFilter(e.target.value);
                    setPage(1);
                  }}
                  className="rounded-lg border border-zinc-700 bg-zinc-950 px-2.5 py-1.5 text-xs text-white outline-none"
                >
                  <option value="All">All genres</option>
                  {MOVIE_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>

                <div className="inline-flex rounded-lg border border-zinc-700 bg-zinc-950 p-0.5">
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs transition-colors ${
                      viewMode === 'list'
                        ? 'bg-[var(--color-brand)] text-black font-semibold'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                    aria-label="List view"
                  >
                    <List size={14} />
                    <span className="hidden sm:inline">List</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('card')}
                    className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs transition-colors ${
                      viewMode === 'card'
                        ? 'bg-[var(--color-brand)] text-black font-semibold'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                    aria-label="Card view"
                  >
                    <LayoutGrid size={14} />
                    <span className="hidden sm:inline">Card</span>
                  </button>
                </div>

                {nav === 'dashboard' && (
                  <button
                    type="button"
                    onClick={() => setNav('movies')}
                    className="text-xs font-medium text-[var(--color-brand)] hover:underline"
                  >
                    View all
                  </button>
                )}
              </div>
            </div>

            {libraryLoading ? (
              <div className="p-4 space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-14 rounded-lg bg-zinc-800/80 animate-pulse" />
                ))}
              </div>
            ) : libraryMovies.length === 0 ? (
              <div className="py-14 text-center px-4">
                <Film size={28} className="mx-auto text-zinc-600 mb-3" />
                <p className="text-sm text-zinc-400 mb-4">No movies found</p>
                <button
                  type="button"
                  onClick={() => {
                    setEditingMovie(null);
                    setIsFormOpen(true);
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--color-brand)] px-4 py-2 text-sm font-semibold text-black"
                >
                  <Plus size={16} /> Add movie
                </button>
              </div>
            ) : viewMode === 'list' ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase tracking-wide text-zinc-500 bg-zinc-950/50">
                    <tr>
                      <th className="px-5 py-3 font-medium">Title</th>
                      <th className="px-5 py-3 font-medium hidden sm:table-cell">Genre</th>
                      <th className="px-5 py-3 font-medium hidden md:table-cell">Duration</th>
                      <th className="px-5 py-3 font-medium hidden lg:table-cell">Year</th>
                      <th className="px-5 py-3 font-medium">Status</th>
                      <th className="px-5 py-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/70">
                    {libraryMovies.map((movie) => {
                      const { status, statusClass } = getMovieStatus(movie);
                      return (
                        <tr key={movie.id} className="hover:bg-zinc-800/40 transition-colors">
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="relative w-10 h-14 shrink-0 rounded-md overflow-hidden bg-zinc-800">
                                <PosterImage
                                  src={movie.posterUrl}
                                  poster={movie.poster}
                                  alt={movie.title}
                                />
                              </div>
                              <p className="font-medium text-white truncate max-w-[200px]">
                                {movie.title}
                              </p>
                            </div>
                          </td>
                          <td className="px-5 py-3 text-zinc-400 hidden sm:table-cell">
                            {movie.type}
                          </td>
                          <td className="px-5 py-3 text-zinc-400 hidden md:table-cell">
                            <span className="inline-flex items-center gap-1">
                              <Clock size={12} />
                              {movie.duration}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-zinc-400 hidden lg:table-cell">
                            <span className="inline-flex items-center gap-1">
                              <Calendar size={12} />
                              {movie.year || '—'}
                            </span>
                          </td>
                          <td className="px-5 py-3">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${statusClass}`}
                            >
                              {status}
                            </span>
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingMovie(movie);
                                  setIsFormOpen(true);
                                }}
                                className="inline-flex items-center gap-1 rounded-lg border border-zinc-700 px-2.5 py-1.5 text-xs text-zinc-200 hover:bg-zinc-800"
                              >
                                <Edit2 size={13} />
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteMovie(movie.id, movie.title)}
                                disabled={isDeleting === movie.id}
                                className="inline-flex items-center gap-1 rounded-lg border border-red-900/50 px-2.5 py-1.5 text-xs text-red-400 hover:bg-red-950/40 disabled:opacity-50"
                              >
                                {isDeleting === movie.id ? (
                                  <span className="w-3.5 h-3.5 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <Trash2 size={13} />
                                )}
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-4 sm:p-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                {libraryMovies.map((movie) => {
                  const { status, statusClass } = getMovieStatus(movie);
                  return (
                    <article
                      key={movie.id}
                      className="rounded-xl border border-zinc-800 bg-zinc-950/50 overflow-hidden hover:border-zinc-600 transition-colors"
                    >
                      <div className="relative aspect-[2/3] bg-zinc-800">
                        <PosterImage
                          src={movie.posterUrl}
                          poster={movie.poster}
                          alt={movie.title}
                        />
                        <span
                          className={`absolute top-2 left-2 rounded-full px-2 py-0.5 text-[10px] font-medium ${statusClass}`}
                        >
                          {status}
                        </span>
                      </div>
                      <div className="p-3 space-y-2">
                        <h3 className="font-medium text-white text-sm truncate" title={movie.title}>
                          {movie.title}
                        </h3>
                        <p className="text-xs text-zinc-500 truncate">
                          {[movie.type, movie.year, movie.duration].filter(Boolean).join(' · ')}
                        </p>
                        <div className="flex gap-1.5 pt-0.5">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingMovie(movie);
                              setIsFormOpen(true);
                            }}
                            className="flex-1 inline-flex items-center justify-center gap-1 rounded-lg border border-zinc-700 py-1.5 text-xs text-zinc-200 hover:bg-zinc-800"
                          >
                            <Edit2 size={12} />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteMovie(movie.id, movie.title)}
                            disabled={isDeleting === movie.id}
                            className="inline-flex items-center justify-center rounded-lg border border-red-900/50 px-2.5 py-1.5 text-xs text-red-400 hover:bg-red-950/40 disabled:opacity-50"
                            aria-label="Delete"
                          >
                            {isDeleting === movie.id ? (
                              <span className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Trash2 size={12} />
                            )}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {nav === 'movies' && total > 0 && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-t border-zinc-800 px-5 py-3">
                <p className="text-xs text-zinc-500">
                  Showing{' '}
                  <span className="tabular-nums text-zinc-300">
                    {rangeFrom}–{rangeTo}
                  </span>{' '}
                  of <span className="tabular-nums text-zinc-300">{total}</span>
                  <span className="text-zinc-600"> · {PAGE_SIZE} per page</span>
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={page <= 1 || isLoading}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="inline-flex items-center gap-1 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-200 hover:bg-zinc-800 disabled:opacity-40 disabled:pointer-events-none"
                  >
                    <ChevronLeft size={14} />
                    Prev
                  </button>
                  <span className="min-w-[4.5rem] text-center text-xs tabular-nums text-zinc-400">
                    {page} / {totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={page >= totalPages || isLoading}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="inline-flex items-center gap-1 rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-200 hover:bg-zinc-800 disabled:opacity-40 disabled:pointer-events-none"
                  >
                    Next
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </section>
        )}
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <MovieForm
            movie={editingMovie ?? undefined}
            onClose={() => {
              setIsFormOpen(false);
              setEditingMovie(null);
            }}
            onSuccess={async (data: Partial<Movie>) => {
              await handleSubmitMovie(
                {
                  title: data.title || '',
                  duration: data.duration || '',
                  type: data.type || 'Action',
                  subtitle: data.subtitle || 'EN',
                  videoUrl: data.videoUrl || '',
                  posterUrl: data.posterUrl || '',
                  year: data.year || '2024',
                },
                editingMovie?.id ?? undefined
              );
            }}
          />
        )}
      </AnimatePresence>
    </AdminShell>
  );
}
