'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Movie } from '@/src/types';
import { X, Play, Pause, Volume2, VolumeX, Maximize2, SkipBack, SkipForward, Heart, Share2, Info } from 'lucide-react';

interface MoviePlayerProps {
  movie: Movie;
  isOpen: boolean;
  onClose: () => void;
}

export default function MoviePlayer({ movie, isOpen, onClose }: MoviePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Format time in MM:SS format
  const formatTime = (time: number) => {
    if (!time || time < 0) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle play/pause
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Handle volume change
  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    setIsMuted(newVolume === 0);
  };

  // Handle seek
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  // Handle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement && playerRef.current) {
      playerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Show/hide controls on mouse movement
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  // Update time
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);

    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('loadedmetadata', updateDuration);

    return () => {
      video.removeEventListener('timeupdate', updateTime);
      video.removeEventListener('loadedmetadata', updateDuration);
    };
  }, []);

  // Auto-hide controls when playing
  useEffect(() => {
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Player Container */}
      <div 
        ref={playerRef}
        className="relative w-full h-full max-w-7xl mx-auto flex items-center justify-center"
        onMouseMove={handleMouseMove}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Video Element */}
          <video
            ref={videoRef}
            src={movie.videoUrl}
            poster={movie.posterUrl}
            className="w-full h-full object-contain max-h-screen"
            onClick={togglePlay}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />

          {/* Loading Overlay */}
          {!movie.videoUrl && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-[#e5a00d] border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-white text-lg">Loading movie...</p>
              </div>
            </div>
          )}

          {/* No Video Available */}
          {!movie.videoUrl && movie.posterUrl && (
            <div className="absolute inset-0 flex items-center justify-center">
              <img 
                src={movie.posterUrl} 
                alt={movie.title}
                className="max-w-full max-h-full object-contain"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <div className="text-center">
                  <Play size={48} className="text-white mb-2" />
                  <p className="text-white text-lg">Video not available</p>
                </div>
              </div>
            </div>
          )}

          {/* Controls Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50 transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}>
            {/* Top Controls */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-start">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowInfo(!showInfo)}
                  className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                >
                  <Info size={20} className="text-white" />
                </button>
                <h2 className="text-white text-2xl font-bold">{movie.title}</h2>
              </div>
              
              <div className="flex items-center gap-2">
                {/* <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`p-2 backdrop-blur-sm rounded-full transition-colors ${
                    isLiked ? 'bg-red-500/30 text-red-400' : 'bg-white/20 hover:bg-white/30 text-white'
                  }`}
                >
                  <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />
                </button> */}
                {/* <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                  <Share2 size={20} className="text-white" />
                </button> */}
                <button
                  onClick={onClose}
                  className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                >
                  <X size={20} className="text-white" />
                </button>
              </div>
            </div>

            {/* Center Play Button */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <button
                onClick={togglePlay}
                className="pointer-events-auto p-6 bg-black/60 backdrop-blur-sm rounded-full hover:bg-black/80 transition-all transform hover:scale-110"
              >
                {isPlaying ? (
                  <Pause size={32} className="text-white" />
                ) : (
                  <Play size={32} className="text-white ml-1" fill="currentColor" />
                )}
              </button>
            </div>
          </div>

          {/* Movie Info Panel */}
          {showInfo && (
            <div className="absolute top-24 left-6 right-6 max-w-md bg-black/90 backdrop-blur-md rounded-2xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4">{movie.title}</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Type:</span>
                  <span className="font-medium">{movie.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Duration:</span>
                  <span className="font-medium">{movie.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Year:</span>
                  <span className="font-medium">{movie.year}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Subtitle:</span>
                  <span className="font-medium">{movie.subtitle}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          background: #e5a00d;
          border-radius: 50%;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          background: #e5a00d;
          border-radius: 50%;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
}
