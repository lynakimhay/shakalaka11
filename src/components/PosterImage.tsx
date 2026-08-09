'use client';

import React, { useState, useEffect } from 'react';
import { Film } from 'lucide-react';
import { getPosterUrl } from '@/src/lib/media';

type PosterImageProps = {
  src?: string | null;
  poster?: string | null;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  /** cover = fill parent (parent must be relative). contain = inline sized box. */
  fit?: 'cover' | 'contain';
};

/**
 * Renders poster when URL works (e.g. Cloudinary).
 * Null / failed load → blank dark surface (no broken icon, no picsum).
 */
export default function PosterImage({
  src,
  poster,
  alt,
  className = 'h-full w-full object-cover',
  loading = 'lazy',
  fit = 'cover',
}: PosterImageProps) {
  const resolved = getPosterUrl(src, poster);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [resolved]);

  if (!resolved || failed) {
    if (fit === 'contain') {
      return (
        <div
          className={`flex items-center justify-center bg-[#141414] ${className}`}
          aria-label={alt ? `${alt} (no image)` : 'No image'}
          role="img"
        >
          <Film size={32} strokeWidth={1.25} className="text-white/20" />
        </div>
      );
    }

    return (
      <div
        className="absolute inset-0 flex items-center justify-center bg-[#141414]"
        aria-label={alt ? `${alt} (no image)` : 'No image'}
        role="img"
      >
        <Film size={28} strokeWidth={1.25} className="text-white/20" />
      </div>
    );
  }

  return (
    <img
      src={resolved}
      alt={alt}
      loading={loading}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
