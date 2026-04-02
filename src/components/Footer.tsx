'use client';

import React from 'react';
import { Instagram, Twitter, Facebook, Youtube } from 'lucide-react';

const Footer = () => (
  <footer className="bg-black/40 border-t border-white/5 pt-16 pb-8 mt-16">
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 mb-16">
        <div className="col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-[#e5a00d] rounded flex items-center justify-center text-black font-bold">S</div>
            <span className="text-2xl font-black tracking-tighter text-white">SHAKALAKA</span>
          </div>
          <div className="flex gap-4">
            <a
              href="https://www.instagram.com/_shakalaka_?igsh=MXA0NmhqaTJrOXRkcw=="
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram size={20} className="text-zinc-500 hover:text-white transition-colors" />
            </a>
            {/* <a
              href="https://www.tiktok.com/@shakalakamovie1?_r=1&_t=ZS-94VpeJ6fW1U"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Twitter size={20} className="text-zinc-500 hover:text-white transition-colors" />
            </a> */}
            <a
              href="https://www.facebook.com/share/1DkgL3mtGH/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Facebook size={20} className="text-zinc-500 hover:text-white transition-colors" />
            </a>
            
          </div>
        </div>
        
        <div>
          <h4 className="text-white font-bold mb-6">Company</h4>
          <ul className="space-y-4 text-sm text-zinc-500">
            <li className="hover:text-white cursor-pointer">About</li>
            <li className="hover:text-white cursor-pointer">Careers</li>
            <li className="hover:text-white cursor-pointer">Our Culture</li>
            <li className="hover:text-white cursor-pointer">Press Room</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Watch Free</h4>
          <ul className="space-y-4 text-sm text-zinc-500">
            <li className="hover:text-white cursor-pointer">TV Channel Finder</li>
            <li className="hover:text-white cursor-pointer">Free Movies</li>
            <li className="hover:text-white cursor-pointer">Trending on Plex</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Discover</h4>
          <ul className="space-y-4 text-sm text-zinc-500">
            <li className="hover:text-white cursor-pointer">What to Watch Now</li>
            <li className="hover:text-white cursor-pointer">What to Watch on Netflix</li>
            <li className="hover:text-white cursor-pointer">Movies Database</li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Resources</h4>
          <ul className="space-y-4 text-sm text-zinc-500">
            <li className="hover:text-white cursor-pointer">Finding Help</li>
            <li className="hover:text-white cursor-pointer">Support Library</li>
            <li className="hover:text-white cursor-pointer">Community Forums</li>
          </ul>
        </div>
      </div>
      
      <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-600">
        <p>© 2026 CineManage. All rights reserved.</p>
        <div className="flex gap-6">
          <span className="hover:text-white cursor-pointer">Privacy & Legal</span>
          <span className="hover:text-white cursor-pointer">Accessibility</span>
          <span className="hover:text-white cursor-pointer">Manage Cookies</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;