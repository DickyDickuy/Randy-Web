'use client';

import React from 'react';

const LOGOS = [
  'NIKE',
  'APPLE',
  'SPOTIFY',
  'RED BULL',
  'BALENCIAGA',
  'SONY',
  'HYUNDAI',
  'ADIDAS',
];

export default function LogoMarquee() {
  return (
    <div className="w-full overflow-hidden select-none py-6 border-y border-purple-400/30 bg-purple-950/20 backdrop-blur-sm">
      <div className="flex w-max animate-marquee space-x-12">
        {[...LOGOS, ...LOGOS, ...LOGOS].map((logo, idx) => (
          <div
            key={idx}
            className="flex items-center space-x-3 text-purple-200/80 font-black text-xl md:text-2xl tracking-widest uppercase hover:text-white transition-colors cursor-pointer"
          >
            <span>{logo}</span>
            <span className="text-purple-400 text-sm">✦</span>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
