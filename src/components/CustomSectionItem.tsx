'use client';

import React from 'react';
import { CustomSection } from '@/src/types';

const CustomSectionItem: React.FC<{ section: CustomSection }> = ({ section }) => (
  <div className="py-16 bg-black/20">
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className={`flex flex-col ${section.imagePosition === 'right' ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12`}>
        <div className="flex-1 space-y-6">
          <h2 className="text-4xl font-black text-white leading-tight">{section.title}</h2>
          <p className="text-lg text-zinc-400 leading-relaxed whitespace-pre-wrap">{section.content}</p>
        </div>
        <div className="flex-1 w-full aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
          <img 
            src={section.imageUrl} 
            alt={section.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </div>
  </div>
);

export default CustomSectionItem;
