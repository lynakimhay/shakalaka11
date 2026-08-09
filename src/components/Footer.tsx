'use client';

import React from 'react';
import { Instagram, Facebook } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const Footer = () => (
  <footer className="border-t border-white/5 bg-black pt-14 pb-8 mt-6">
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
        <div className="col-span-2 md:col-span-1">
          <Image
            src="/uploads/logo.png"
            alt="Shakalaka Movie"
            width={160}
            height={48}
            className="h-10 w-auto object-contain mb-5"
          />
          <div className="flex gap-4">
            <a
              href="https://www.instagram.com/_shakalaka_?igsh=MXA0NmhqaTJrOXRkcw=="
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <Instagram size={18} className="text-white/40 hover:text-white transition-colors" />
            </a>
            <a
              href="https://www.facebook.com/share/1DkgL3mtGH/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <Facebook size={18} className="text-white/40 hover:text-white transition-colors" />
            </a>
            <a
              href="https://www.tiktok.com/@shakalakamovie1?_r=1&_t=ZS-94VpeJ6fW1U"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-white transition-colors text-xs font-bold tracking-wide"
            >
              TikTok
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4 text-sm">Watch</h4>
          <ul className="space-y-3 text-sm text-white/45">
            <li>
              <Link href="/" className="hover:text-white transition-colors">
                Home
              </Link>
            </li>
            <li>
              <Link href="/?type=Action" className="hover:text-white transition-colors">
                Action
              </Link>
            </li>
            <li>
              <Link href="/admin" className="hover:text-white transition-colors">
                Admin
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4 text-sm">Company</h4>
          <ul className="space-y-3 text-sm text-white/45">
            <li>
              <a
                href="https://www.facebook.com/share/1DkgL3mtGH/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="https://www.instagram.com/_shakalaka_"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-4 text-sm">Follow</h4>
          <p className="text-sm text-white/45 leading-relaxed">
            Private movie experiences and the latest titles on Shakalaka Movie.
          </p>
        </div>
      </div>

      <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between gap-3 text-xs text-white/35">
        <p>© 2026 Shakalaka Movie. All rights reserved.</p>
        <div className="flex gap-5">
          <span>Privacy</span>
          <span>Terms</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
