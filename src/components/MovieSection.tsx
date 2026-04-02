'use client';

import React, { useState } from 'react';
import { Movie } from '@/src/types';
import { Play, Clock, Calendar, Star } from 'lucide-react';
import MoviePlayer from './MoviePlayer';

const VideoCard = ({ movie }: { movie: Movie }) => {
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  return (
    <>
      <div className="group cursor-pointer" onClick={() => setIsPlayerOpen(true)}>
        <div className="relative aspect-video rounded-2xl overflow-hidden bg-zinc-900 border border-white/5 group-hover:border-white/20 transition-all duration-300 shadow-2xl group-hover:shadow-[#e5a00d]/20">
          {movie.videoUrl ? (
            <video
              src={movie.videoUrl}
              poster={movie.posterUrl}
              muted
              loop
              playsInline
              preload="metadata"
              className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-500"
            />
          ) : (
            <img
              src={movie.posterUrl || `https://picsum.photos/seed/${movie.id}/1000/562`}
              alt={movie.title}
              className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-500"
              onError={(e) => {
                const img = e.currentTarget as HTMLImageElement;
                img.onerror = null;
                img.src = `https://picsum.photos/seed/${movie.id}/1000/562`;
              }}
            />
          )}

          {/* Type Badge */}
          <div className="absolute top-4 right-4">
            <span className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white text-sm font-bold rounded-full shadow-lg border border-white/20">
              {movie.type}
            </span>
          </div>

          {/* Rating */}
          <div className="absolute top-4 left-4">
            <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-2 rounded-full border border-white/10">
              <Star size={14} className="text-yellow-400 fill-yellow-400" />
              <span className="text-white text-sm font-bold">4.5</span>
            </div>
          </div>

          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-black/60 backdrop-blur-sm rounded-full p-6 transform scale-90 group-hover:scale-110 transition-transform duration-300 border border-white/20">
              <Play size={32} className="text-white ml-1" fill="currentColor" />
            </div>
          </div>

          {/* Gradient Overlay */}
        </div>

        {/* Movie Info */}
        <div className="mt-6 space-y-3">
          <h3 className="font-bold text-2xl text-white group-hover:text-[#e5a00d] transition-colors truncate">
            {movie.title}
          </h3>
          <div className="flex items-center gap-4 text-base text-zinc-400">
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span>{movie.duration}</span>
            </div>
            {movie.year && (
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{movie.year}</span>
              </div>
            )}
            <div className="px-3 py-1 bg-white/10 rounded-full text-sm">
              {movie.subtitle}
            </div>
          </div>
        </div>
      </div>

      {/* Movie Player Modal */}
      <MoviePlayer 
        movie={movie} 
        isOpen={isPlayerOpen} 
        onClose={() => setIsPlayerOpen(false)} 
      />
    </>
  );
};

const PosterCard = ({ movie }: { movie: Movie }) => {
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  return (
    <>
      <div className="group cursor-pointer" onClick={() => setIsPlayerOpen(true)}>
        {/* 3D Standing Card Container */}
        <div className="relative transform-gpu" style={{ perspective: '1500px' }}>
          {/* Enhanced Shadow/Base for 3D Effect */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/60 via-black/30 to-transparent blur-2xl transform translate-y-4 scale-110" />
          
          {/* Main Card with Dramatic 3D Perspective */}
          <div className="relative aspect-[1/3] rounded-t-3xl rounded-b-2xl overflow-hidden bg-zinc-900 border border-white/10 group-hover:border-white/30 transition-all duration-500 group-hover:scale-105 shadow-3xl group-hover:shadow-[#e5a00d]/30 transform-gpu"
               style={{
                 transform: 'rotateX(8deg) translateZ(40px)',
                 transformStyle: 'preserve-3d',
                 transformOrigin: 'center bottom',
                 boxShadow: '0 35px 70px -20px rgba(0,0,0,0.5)'
               }}>
            {/* Main Image - Dramatic Standing Poster Effect */}
            <img
              src={movie.posterUrl || `https://picsum.photos/seed/${movie.id}/400/1200`}
              alt={movie.title}
              className="w-full h-full object-cover opacity-100 group-hover:opacity-100 transition-all duration-500"
              style={{
                transform: 'rotateX(-8deg) translateZ(40px)',
                transformStyle: 'preserve-3d'
              }}
              onError={(e) => {
                const img = e.currentTarget as HTMLImageElement;
                img.onerror = null;
                img.src = `https://picsum.photos/seed/${movie.id}/400/1200`;
              }}
            />

            {/* Enhanced Top Badges - More 3D */}
            <div className="absolute top-4 right-4 z-10">
              <span className="px-3 py-1.5 bg-gradient-to-r from-red-600/95 to-red-500/95 text-white text-xs font-bold rounded-full shadow-xl backdrop-blur-md border border-white/20 transform translateZ(20px)">
                {movie.type}
              </span>
            </div>

            <div className="absolute top-4 left-4 z-10">
              <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 shadow-lg transform translateZ(20px)">
                <Star size={12} className="text-yellow-400 fill-yellow-400" />
                <span className="text-white text-xs font-bold">4.5</span>
              </div>
            </div>

            {/* Enhanced Play Button - More 3D */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
              <div className="bg-black/85 backdrop-blur-lg rounded-full p-7 transform scale-90 group-hover:scale-110 transition-transform duration-300 border-2 border-white/30 shadow-2xl transform translateZ(60px)">
                <Play size={36} className="text-white ml-1" fill="currentColor" />
              </div>
            </div>

            {/* Enhanced Bottom Gradient */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/85 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Enhanced Movie Info */}
            <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10">
              <h3 className="font-bold text-xl text-white mb-2 truncate drop-shadow-lg">
                {movie.title}
              </h3>
              <div className="flex items-center gap-3 text-sm text-zinc-300">
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {movie.duration}
                </span>
                {movie.year && <span>• {movie.year}</span>}
                <span>• {movie.subtitle}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Movie Player Modal */}
      <MoviePlayer 
        movie={movie} 
        isOpen={isPlayerOpen} 
        onClose={() => setIsPlayerOpen(false)} 
      />
    </>
  );
};

interface MovieSectionProps {
  title: string;
  movies: Movie[];
  type?: 'video' | 'poster';
  showAll?: boolean;
}

export default function MovieSection({ title, movies, type = 'poster', showAll = false }: MovieSectionProps) {
  const displayMovies = showAll ? movies : movies.slice(0, 8);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          {title}
          {!showAll && movies.length > 8 && (
            <span className="text-sm text-zinc-400 font-normal">
              ({movies.length} movies)
            </span>
          )}
        </h2>
        {!showAll && movies.length > 8 && (
          <button className="text-[#e5a00d] hover:text-[#f4b840] font-medium transition-colors">
            View All →
          </button>
        )}
      </div>

      {movies.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Play size={24} className="text-zinc-600" />
          </div>
          <p className="text-zinc-400 text-lg">No movies found</p>
          <p className="text-zinc-500 text-sm mt-1">Check back later for new releases</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-10">
          {displayMovies.map((movie) => (
            <div key={movie.id}>
              {type === 'video' ? <VideoCard movie={movie} /> : <PosterCard movie={movie} />}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}