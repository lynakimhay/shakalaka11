'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import { Plus, Trash2, Edit2, Film, Search, Grid, List, Star, Calendar, Clock, Filter, BarChart3, Users, TrendingUp } from 'lucide-react';
import Navbar from '@/src/components/Navbar';
import MovieForm from '@/src/components/admin/MovieForm';
import { Movie } from '@/src/types';

export default function AdminPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);

  // Fetch all movies
  const fetchMovies = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/movies');
      if (!res.ok) throw new Error('Failed to fetch movies');
      const data: Movie[] = await res.json();
      setMovies(data);
    } catch (error: any) {
      console.error('Error fetching movies:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  // Filter movies based on search
  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    movie.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Create or update movie
  const handleSubmitMovie = async (movieData: Omit<Movie, 'id'>, id?: string | number) => {
    try {
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

      await fetchMovies();
      setIsFormOpen(false);
      setEditingMovie(null);
    } catch (error: any) {
      console.error('Error saving movie:', error.message);
      alert(`Error: ${error.message}`);
    }
  };

  // Delete movie
  const handleDeleteMovie = async (id: string | number) => {
    if (!confirm('Are you sure you want to delete this movie?')) return;

    setIsDeleting(id);
    try {
  const res = await fetch(`/api/movies/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to delete movie');
      }

      await fetchMovies();
    } catch (error: any) {
      console.error('Error deleting movie:', error.message);
      alert(`Error deleting movie: ${error.message}`);
    } finally {
      setIsDeleting(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#e5a00d] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-zinc-400">Loading movie library...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Stats */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
            <div>
              <h1 className="text-5xl font-black text-white mb-3 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                Movie Dashboard
              </h1>
              <p className="text-zinc-400 text-lg">Manage your movie collection with professional tools</p>
            </div>
            <button
              onClick={() => {
                setEditingMovie(null);
                setIsFormOpen(true);
              }}
              className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#e5a00d] to-[#f4b840] text-black font-bold rounded-2xl hover:scale-105 transition-all shadow-2xl shadow-[#e5a00d]/30 hover:shadow-[#e5a00d]/50"
            >
              <Plus size={22} />
              <span>Add New Movie</span>
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Search movies by title or type..."
                value={searchTerm}
                onChange={(e) => {
                  setIsSearching(true);
                  setSearchTerm(e.target.value);
                  setTimeout(() => {
                    setIsSearching(false);
                  }, 500);
                }}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-[#e5a00d] outline-none text-white placeholder-zinc-500 transition-all"
              />
              {isSearching && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-[#e5a00d] border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-white/5 border border-white/10 rounded-2xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-xl transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-[#e5a00d] text-black' 
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Grid size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-xl transition-all ${
                  viewMode === 'list' 
                    ? 'bg-[#e5a00d] text-black' 
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Movie Library */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Film size={28} className="text-[#e5a00d]" />
              Movie Library
              <span className="text-sm font-normal text-zinc-400 bg-white/5 px-3 py-1 rounded-full">
                {filteredMovies.length} {filteredMovies.length === 1 ? 'movie' : 'movies'}
              </span>
            </h2>
          </div>

          {filteredMovies.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Film size={32} className="text-zinc-600" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No movies found</h3>
              <p className="text-zinc-400 mb-6">
                {searchTerm ? 'Try adjusting your search terms' : 'Start by adding your first movie'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => {
                    setEditingMovie(null);
                    setIsFormOpen(true);
                  }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#e5a00d] text-black font-bold rounded-2xl hover:scale-105 transition-all"
                >
                  <Plus size={18} /> Add Your First Movie
                </button>
              )}
            </div>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
                : "space-y-4"
            }>
              {filteredMovies.map((movie) => (
                <div
                  key={movie.id}
                  className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden group hover:border-white/20 transition-all duration-300"
                >
                  {viewMode === 'grid' ? (
                    // Grid View
                    <>
                      <div className="aspect-video relative overflow-hidden">
                        <img
                          src={movie.posterUrl || `https://picsum.photos/seed/${movie.id}/400/300`}
                          className="w-full h-full object-cover opacity-70 group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            const img = e.currentTarget as HTMLImageElement;
                            img.onerror = null;
                            img.src = `https://picsum.photos/seed/${movie.id}/400/300`;
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-lg font-bold text-white mb-1 truncate">{movie.title}</h3>
                          <div className="flex items-center gap-3 text-xs text-zinc-300">
                            <span className="px-2 py-1 bg-white/10 rounded-full">{movie.type}</span>
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              {movie.duration}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          {movie.year && (
                            <span className="text-xs text-zinc-400 flex items-center gap-1">
                              <Calendar size={12} />
                              {movie.year}
                            </span>
                          )}
                          <span className="text-xs text-zinc-400">{movie.subtitle}</span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingMovie(movie);
                              setIsFormOpen(true);
                            }}
                            className="p-2.5 bg-white/5 text-white rounded-xl hover:bg-white/10 transition-all hover:scale-110"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteMovie(movie.id)}
                            disabled={isDeleting === movie.id}
                            className="p-2.5 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isDeleting === movie.id ? (
                              <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Trash2 size={16} />
                            )}
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    // List View
                    <div className="flex gap-4 p-4">
                      <img
                        src={movie.posterUrl || `https://picsum.photos/seed/${movie.id}/150/100`}
                        className="w-24 h-16 object-cover rounded-xl"
                        onError={(e) => {
                          const img = e.currentTarget as HTMLImageElement;
                          img.onerror = null;
                          img.src = `https://picsum.photos/seed/${movie.id}/150/100`;
                        }}
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-white mb-1">{movie.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-zinc-400">
                          <span className="px-2 py-1 bg-white/10 rounded-full text-xs">{movie.type}</span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {movie.duration}
                          </span>
                          {movie.year && (
                            <span className="flex items-center gap-1">
                              <Calendar size={14} />
                              {movie.year}
                            </span>
                          )}
                          <span>{movie.subtitle}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 items-center">
                        <button
                          onClick={() => {
                            setEditingMovie(movie);
                            setIsFormOpen(true);
                          }}
                          className="p-2.5 bg-white/5 text-white rounded-xl hover:bg-white/10 transition-all hover:scale-110"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteMovie(movie.id)}
                          disabled={isDeleting === movie.id}
                          className="p-2.5 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isDeleting === movie.id ? (
                            <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* MovieForm modal */}
      <AnimatePresence>
        {isFormOpen && (
          <MovieForm
            movie={editingMovie ?? undefined}
            onClose={() => {
              setIsFormOpen(false);
              setEditingMovie(null);
            }}
            onSuccess={async (data: Omit<Movie, 'id'>) => {
              // Use the ID of editingMovie for updates (keep as string if that's what DB uses)
              await handleSubmitMovie(
                data,
                editingMovie?.id ?? undefined
              );
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}