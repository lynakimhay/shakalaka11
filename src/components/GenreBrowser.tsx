'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { MOVIE_TYPES } from '@/src/constants';

const GenreBrowser = ({ selected, onSelect }: { selected?: string; onSelect?: (g?: string) => void }) => (
  <div className="py-8">
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          Browse by Genre <ChevronRight size={20} className="text-[#e5a00d]" />
        </h2>
      </div>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-4">
        {MOVIE_TYPES.map(genre => {
          const active = selected === genre;
          return (
            <button 
              key={genre}
              onClick={() => onSelect?.(active ? undefined : genre)}
              className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${active ? 'bg-[#e5a00d] text-black border-none' : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20'}`}
            >
              {genre}
            </button>
          );
        })}
      </div>
    </div>
  </div>
);

export default GenreBrowser;
