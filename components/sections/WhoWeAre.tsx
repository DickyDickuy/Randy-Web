'use client';

import React from 'react';
import SplitScreenSection from '@/components/layout/SplitScreenSection';
import ThreeGraphic from '@/components/ui/ThreeGraphic';

export default function WhoWeAre() {
  const leftContent = (
    <div className="flex flex-col justify-between h-full p-6 sm:p-10 md:p-12 lg:p-16 text-black select-none">
      {/* Top Header */}
      <div>
        <div className="flex items-center space-x-3 mb-6">
          <span className="w-2.5 h-2.5 bg-black rounded-full animate-ping" />
          <span className="font-mono text-xs uppercase font-extrabold tracking-widest text-black/70">
            01 / EXECUTIVE VISION
          </span>
        </div>
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none uppercase text-black">
          TURNING<br />VISION A REALITY
        </h2>
      </div>

      {/* Interactive 3D WebGL Element */}
      <div className="my-auto py-6">
        <ThreeGraphic />
      </div>

      {/* Footer Tagline */}
      <div className="border-t border-black/20 pt-4 flex justify-between items-center text-xs font-mono font-bold text-black">
        <span>10 YEARS OF LEADERSHIP</span>
        <span>GLOBAL ENTERPRISE PORTFOLIO</span>
      </div>
    </div>
  );

  const rightContent = (
    <div className="flex flex-col justify-center min-h-dvh p-6 sm:p-10 md:p-16 lg:p-24 text-black space-y-8 sm:space-y-12">
      <div className="space-y-6">
        <h3 className="text-2xl md:text-4xl font-bold tracking-tight leading-snug">
          "Every transformational enterprise begins with an unshakeable vision executed with relentless precision."
        </h3>
        <p className="text-black/80 text-base md:text-xl font-normal leading-relaxed">
          Over the past decade, I have led, scaled, and directed high-stakes creative and technical ventures. As CEO and Creative Director, my mission is singular: fusing executive authority, spatial innovation, and cutting-edge interactive technology to build brand experiences that command global attention.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-8 border-y border-black/20 py-8">
        <div>
          <span className="block text-4xl md:text-6xl font-black font-mono">10+</span>
          <span className="text-xs uppercase font-bold text-black/70 tracking-wider">Years Executive Leadership</span>
        </div>
        <div>
          <span className="block text-4xl md:text-6xl font-black font-mono">GLOBAL</span>
          <span className="text-xs uppercase font-bold text-black/70 tracking-wider">Client Reach</span>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-lg font-bold uppercase tracking-wider">Core Leadership Philosophy</h4>
        <p className="text-black/75 text-base md:text-lg leading-relaxed">
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
