'use client';

import React, { useRef, useState, useEffect } from 'react';

const CLIENT_LOGOS = [
  "/images/client-KTM.png",
  "/images/client-astra.png",
  "/images/client-bank-bni.png",
  "/images/client-bank-bri.png",
  "/images/client-bank-bsi.png",
  "/images/client-bank-hsbc.png",
  "/images/client-citilink.png",
  "/images/client-dana.png",
  "/images/client-dbs.png",
  "/images/client-djarum.png",
  "/images/client-flip.png",
  "/images/client-garuda-airline.png",
  "/images/client-kominfo.png",
  "/images/client-motogp.png",
  "/images/client-noice.png",
  "/images/client-ocbc.png",
  "/images/client-pokemon.png",
];

export default function LogoMarquee() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mousePosRef = useRef<{ x: number; y: number } | null>(null);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  useEffect(() => {
    let animFrameId: number;

    const checkHover = () => {
      if (mousePosRef.current) {
        const el = document.elementFromPoint(mousePosRef.current.x, mousePosRef.current.y);
        const logoEl = el?.closest('[data-logo-index]');
        if (logoEl) {
          const idx = Number(logoEl.getAttribute('data-logo-index'));
          setHoveredIdx(idx);
        } else {
          setHoveredIdx(null);
        }
      } else {
        setHoveredIdx(null);
      }
      animFrameId = requestAnimationFrame(checkHover);
    };

    animFrameId = requestAnimationFrame(checkHover);

    return () => {
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    mousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseLeave = () => {
    mousePosRef.current = null;
    setHoveredIdx(null);
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="w-full overflow-hidden select-none py-10 bg-white group border border-gray-200 rounded-3xl"
    >
      <div className="flex w-max items-center animate-marquee gap-16 md:gap-24 px-8 md:px-12">
        {[...CLIENT_LOGOS, ...CLIENT_LOGOS].map((src, idx) => (
          <div
            key={idx}
            data-logo-index={idx}
            className={`shrink-0 flex items-center justify-center transition-all duration-300 cursor-pointer grayscale-0 opacity-100 ${
              hoveredIdx === idx
                ? 'md:grayscale-0 md:opacity-100 md:scale-110'
                : 'md:grayscale md:opacity-60'
            }`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt="Client Logo"
              className="h-10 md:h-12 lg:h-14 w-auto object-contain pointer-events-none"
            />
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </div>
  );
}
