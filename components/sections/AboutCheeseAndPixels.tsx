'use client';

import React from 'react';
import SplitScreenSection from '@/components/layout/SplitScreenSection';
import LogoMarquee from '@/components/ui/LogoMarquee';

export default function AboutCheeseAndPixels() {
  const leftContent = (
    <div className="flex flex-col justify-between h-full p-8 md:p-12 lg:p-16 text-white select-none">
      <div>
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif font-semibold tracking-tight leading-none uppercase text-white mb-6 hover:tracking-wider transition-all duration-300">
          DECADE<br />OF<br />INNOVATION
        </h2>
        <p className="font-lato text-neutral-300 text-sm md:text-base max-w-md font-normal leading-relaxed">
          A decade of pioneering creative technology and scaling high-performing teams, grounded in integrity and purpose.
        </p>
      </div>

      {/* Infinite Logo Marquee */}
      <div className="my-8 w-full">
        <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400 block mb-3">
          TRUSTED BY GLOBAL BRANDS & ENTERPRISES
        </span>
        <LogoMarquee />
      </div>

      <div className="border-t border-neutral-800 pt-4 flex justify-between items-center text-xs font-lato font-semibold uppercase tracking-wider text-neutral-400">
        <span>VISIONARY EDGE</span>
        <span>HUMAN-CENTRIC SYSTEMS</span>
      </div>
    </div>
  );

  const rightContent = (
    <div className="flex flex-col justify-center min-h-dvh p-6 sm:p-10 md:p-16 lg:p-24 text-neutral-900 space-y-8 sm:space-y-12 bg-white">
      <div className="space-y-6">
        <h3 className="text-2xl md:text-4xl font-serif font-semibold tracking-tight leading-snug text-black">
          "Excellence in executive leadership requires balancing bold risk-taking with unyielding integrity."
        </h3>
        <p className="font-lato text-black/90 text-base md:text-xl font-normal leading-relaxed">
          Building a top-tier creative studio demands resilience, strategic foresight, and thousands of high-stakes decisions. Behind every global product launch and spatial experience, my anchor is a commitment to human-centric principles, long-term brand equity, and sustainable execution.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-6 border-y border-neutral-200">
        <div className="space-y-2">
          <h4 className="text-lg font-serif font-semibold text-black tracking-tight">Visionary Edge</h4>
          <p className="font-lato text-black/80 text-sm md:text-base font-normal leading-relaxed">
            Refusing industry defaults. Constantly discovering new frontiers in creative engineering, spatial design, and executive strategy.
          </p>
        </div>

        <div className="space-y-2">
          <h4 className="text-lg font-serif font-semibold text-black tracking-tight">Human-Centric Systems</h4>
          <p className="font-lato text-black/80 text-sm md:text-base font-normal leading-relaxed">
            Empowering clients and multidisciplinary engineering teams with transparent, high-trust leadership and clear communication.
          </p>
        </div>
      </div>


    </div>
  );

  return (
    <SplitScreenSection
      id="the-journey"
      leftBg="bg-black"
      rightBg="bg-white"
      left={leftContent}
      right={rightContent}
      desktopReverse={true}
    />
  );
}
