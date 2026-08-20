'use client';

import React from 'react';
import SplitScreenSection from '@/components/layout/SplitScreenSection';
import { Orb } from '@/components/ui/orb';

export default function WhoWeAre() {
  const leftContent = (
    <div className="flex flex-col justify-between h-full p-6 sm:p-10 md:p-12 lg:p-16 text-black select-none">
      {/* Top Header */}
      <div>

        <h2 className="text-5xl md:text-7xl lg:text-8xl font-serif font-semibold tracking-tight leading-none uppercase text-black hover:tracking-wider transition-all duration-300">
          TURNING<br />VISION A REALITY
        </h2>
      </div>

      {/* Interactive 3D WebGL Orb Element */}
      <div className="my-auto py-4 sm:py-8 flex items-center justify-center w-full overflow-hidden">
        <Orb />
      </div>

      {/* Footer Tagline */}
      <div className="border-t border-black/20 pt-4 flex justify-between items-center text-xs font-lato font-semibold uppercase tracking-wider text-black/70">
        <span>10 YEARS OF LEADERSHIP</span>
        <span>GLOBAL ENTERPRISE PORTFOLIO</span>
      </div>
    </div>
  );

  const rightContent = (
    <div className="flex flex-col justify-center min-h-dvh p-6 sm:p-10 md:p-16 lg:p-24 text-black space-y-8 sm:space-y-12">
      <div className="space-y-6">
        <h3 className="text-2xl md:text-4xl font-serif font-semibold tracking-tight leading-snug text-black">
          "Every transformational enterprise begins with an unshakeable vision executed with relentless precision."
        </h3>
        <p className="font-lato text-black/90 text-base md:text-xl font-normal leading-relaxed">
          Over the past decade, I have led, scaled, and directed high-stakes creative and technical ventures. As CEO and Creative Director, my mission is singular: fusing executive authority, spatial innovation, and cutting-edge interactive technology to build brand experiences that command global attention.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-8 border-y border-black/20 py-8 items-end">
        <div>
          <span className="block text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold text-black tracking-tight leading-none">
            10+
          </span>
          <span className="text-xs uppercase font-bold text-black/70 tracking-wider font-lato block mt-3">
            Years Executive Leadership
          </span>
        </div>
        <div>
          <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-black tracking-tight leading-none">
            GLOBAL
          </span>
          <span className="text-xs uppercase font-bold text-black/70 tracking-wider font-lato block mt-3">
            Client Reach
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-lg font-serif font-semibold text-black tracking-tight">Core Leadership Philosophy</h4>
        <p className="font-lato text-black/90 text-base md:text-lg font-normal leading-relaxed">
          True leadership isn't just about flawless logistics—it's about creating enduring value, inspiring multidisciplinary teams, and pushing technical boundaries to leave a lasting mark.
        </p>
      </div>
    </div>
  );

  return (
    <SplitScreenSection
      id="about-me"
      leftBg="bg-white"
      rightBg="bg-white"
      left={leftContent}
      right={rightContent}
    />
  );
}
