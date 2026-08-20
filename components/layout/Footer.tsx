'use client';

import React from 'react';
import Link from 'next/link';
import { Teko } from 'next/font/google';
import { LiquidMetalButton } from '@/components/ui/liquid-metal-button';

const teko = Teko({ 
  subsets: ['latin'], 
  weight: ['300', '400', '500', '600', '700'] 
});

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="w-full bg-white text-black pt-0 md:pt-10 pb-6 px-4 sm:px-8 md:px-12 lg:px-16 overflow-hidden">
      <div className="max-w-[1750px] mx-auto">
        <div className="py-16 sm:py-24 md:py-28 lg:py-32 xl:py-36 bg-black border border-neutral-800 rounded-[30px] flex flex-col items-center text-center px-4 sm:px-8 relative overflow-hidden">
          
          <span 
            className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light leading-none tracking-normal text-white/60 pb-4 sm:pb-6 uppercase ${teko.className}`}
          >
            Looking for a new talent
          </span>
          
          <h4 
            className={`w-full max-w-full text-[clamp(26px,6.5vw,128px)] font-medium leading-[0.9] mb-8 sm:mb-10 text-white tracking-tight whitespace-nowrap overflow-hidden transition-opacity duration-300 hover:opacity-75 ${teko.className}`}
          >
            <Link 
              href="mailto:ceo@nomina-creative.com"
              className="inline-block transition-transform duration-300 hover:scale-[1.01]"
            >
              ceo@nomina-creative.com
            </Link>
          </h4>

          <div className="flex flex-wrap items-center justify-center gap-5 z-10">
            <LiquidMetalButton
              label="CONTACT ME ↗"
              href="mailto:ceo@nomina-creative.com"
            />
          </div>

        </div>

        {/* Copyright Area */}
        <div className="pt-6 pb-4 px-2 flex flex-col md:flex-row justify-between items-center text-center gap-4 font-lato">
          
          <div className="text-sm font-normal text-neutral-500 m-0">
            <p className="m-0 font-lato text-neutral-500">© {currentYear} all rights reserved</p>
          </div>
          
          <div className="text-sm font-normal text-neutral-500 m-0">
            <p className="m-0 font-lato text-neutral-500">Made by Randy.</p>
          </div>

        </div>
      </div>
    </footer>
  );
}
