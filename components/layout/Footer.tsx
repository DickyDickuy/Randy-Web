'use client';

import React from 'react';
import Link from 'next/link';
import { Teko } from 'next/font/google';

const teko = Teko({ 
  subsets: ['latin'], 
  weight: ['300', '400', '500', '600', '700'] 
});

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="w-full bg-white text-black pt-0 md:pt-10 pb-4 px-4 sm:px-8 md:px-12 lg:px-16 overflow-hidden">
      <div className="max-w-[1750px] mx-auto">
        <div className="py-[100px] xl:py-[150px] bg-black border border-neutral-800 rounded-[30px] flex flex-col items-center text-center px-4 relative">
          
          <span 
            className={`text-[38px] md:text-[45px] xl:text-[60px] font-light leading-[0.8] tracking-[-1.8px] text-white/60 pb-[26px] ${teko.className}`}
          >
            Looking for a new talent
          </span>
          
          <h4 
            className={`text-[52px] sm:text-[65px] md:text-[115px] lg:text-[150px] xl:text-[180px] font-medium leading-[0.8] mb-[35px] text-white tracking-normal xl:tracking-[-5.4px] transition-opacity duration-300 hover:opacity-70 ${teko.className}`}
          >
            <Link href="mailto:hello@gmail.com">
              hello@gmail.com
            </Link>
          </h4>

          <div className="flex flex-wrap items-center justify-center gap-5 z-10">
            <Link 
              href="#contact" 
              className="text-[20px] font-semibold rounded-[14px] px-[21px] py-[10px] text-white border border-white/10 hover:text-black hover:bg-white transition-colors duration-300 flex items-center"
            >
              Contact Me 
              <span className="ml-1 opacity-70">↗</span>
            </Link>
          </div>

        </div>

        {/* Copyright Area */}
        <div className="pt-[35px] pb-[35px] px-2 flex flex-col md:flex-row justify-between items-center text-center gap-6">
          
          <div className="text-[16px] font-medium leading-none text-neutral-500 m-0">
            <p className="m-0">© {currentYear} all rights reserved</p>
          </div>
          
          <div className="text-[16px] font-medium leading-none text-neutral-500 m-0">
            <p className="m-0">Made by Randy.</p>
          </div>

        </div>
      </div>
    </footer>
  );
}
