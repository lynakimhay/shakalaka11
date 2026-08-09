'use client';

import React from 'react';

function CardSkeleton({ layout = 'portrait' }: { layout?: 'portrait' | 'landscape' }) {
  const aspect = layout === 'portrait' ? 'aspect-[2/3]' : 'aspect-video';
  const width =
    layout === 'portrait'
      ? 'w-[140px] sm:w-[168px] shrink-0'
      : 'w-[240px] sm:w-[300px] shrink-0';

  return (
    <div className={width}>
      <div className="w-full animate-pulse">
        <div className={`${aspect} rounded-xl bg-[#1a1a1a] ring-1 ring-white/5`} />
        <div className="mt-2.5 h-3.5 w-3/4 rounded bg-[#1a1a1a]" />
        <div className="mt-2 h-3 w-1/2 rounded bg-[#141414]" />
      </div>
    </div>
  );
}

export function MovieGridSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="w-full animate-pulse">
            <div className="aspect-[2/3] rounded-xl bg-[#1a1a1a] ring-1 ring-white/5" />
            <div className="mt-2.5 h-3.5 w-3/4 rounded bg-[#1a1a1a]" />
            <div className="mt-2 h-3 w-1/2 rounded bg-[#141414]" />
          </div>
        ))}
      </div>
    </div>
  );
}

function RowSkeletonShell({
  cardClass,
  aspectClass,
  count = 6,
}: {
  cardClass: string;
  aspectClass: string;
  count?: number;
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto">
        <div className="flex items-center gap-3">
          <span
            aria-hidden
            className="h-5 w-1 shrink-0 rounded-full bg-gradient-to-b from-[#f0c94a] via-[var(--color-brand)] to-[#c4890a] animate-pulse"
          />
          <div className="h-6 w-28 rounded bg-[#1a1a1a] animate-pulse" />
        </div>
        <div className="h-4 w-16 rounded bg-[#1a1a1a] animate-pulse" />
      </div>
      <div className="flex gap-3 overflow-hidden px-4 sm:px-6 lg:px-8">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className={cardClass}>
            <div className="w-full animate-pulse">
              <div className={`${aspectClass} rounded-xl bg-[#1a1a1a] ring-1 ring-white/5`} />
              <div className="mt-2.5 h-3.5 w-3/4 rounded bg-[#1a1a1a]" />
              <div className="mt-2 h-3 w-1/2 rounded bg-[#141414]" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Keep layouts hardcoded so SSR and client always match. */
export function HomeSectionsSkeleton() {
  return (
    <div className="space-y-10">
      {/* Latest — landscape */}
      <RowSkeletonShell
        cardClass="w-[240px] sm:w-[300px] shrink-0"
        aspectClass="aspect-video"
      />
      {/* Action — portrait */}
      <RowSkeletonShell
        cardClass="w-[140px] sm:w-[168px] shrink-0"
        aspectClass="aspect-[2/3]"
      />
      {/* Drama — portrait */}
      <RowSkeletonShell
        cardClass="w-[140px] sm:w-[168px] shrink-0"
        aspectClass="aspect-[2/3]"
      />
    </div>
  );
}

export function MovieRowSkeleton({
  layout = 'portrait',
  count = 6,
}: {
  title?: string;
  layout?: 'portrait' | 'landscape';
  count?: number;
}) {
  return (
    <div className="flex gap-3 overflow-hidden px-4 sm:px-6 lg:px-8">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} layout={layout} />
      ))}
    </div>
  );
}

export default CardSkeleton;
