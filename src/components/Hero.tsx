'use client';

import React from 'react';
import { motion } from 'motion/react';
import { HeroContent } from '@/src/types';

const Hero = ({ content }: { content: HeroContent }) => (
  <div className="relative h-[500px] w-full overflow-hidden flex items-center">
    <div className="absolute inset-0 z-0">
      <img 
        src={content.imageUrl} 
        alt="Hero Background" 
        className="w-full h-full object-cover opacity-30"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
    </div>
    
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl"
      >
        <h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight">
          {content.title}
        </h1>
        <p className="text-xl text-zinc-300 mb-8 leading-relaxed">
          {content.subtitle}
        </p>
        <div className="flex gap-4">
          <button className="bg-[#e5a00d] text-black px-8 py-3 rounded-full font-bold text-lg hover:scale-105 transition-transform">
            {content.buttonText}
          </button>
        </div>
      </motion.div>
    </div>

    {/* Floating posters decoration */}
    <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden xl:flex gap-4 opacity-40 rotate-12 translate-x-20">
      {[1,2,3].map(i => (
        <div key={i} className="flex flex-col gap-4">
          {[1,2,3].map(j => (
            <div key={j} className="w-40 h-60 bg-zinc-800 rounded-lg overflow-hidden border border-white/10">
              <img src={`https://picsum.photos/seed/hero-${i}-${j}/200/300`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
          ))}
        </div>
      ))}
    </div>
  </div>
);

export default Hero;
