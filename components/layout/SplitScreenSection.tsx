'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface SplitScreenSectionProps {
  id: string;
  leftBg: string; // Tailwind class, e.g. "bg-black"
  rightBg: string; // Tailwind class, e.g. "bg-white"
  left: React.ReactNode;
  right: React.ReactNode;
  pinLeft?: boolean; // Default true
  desktopReverse?: boolean; // If true, swaps visual columns on desktop
  className?: string;
}

export default function SplitScreenSection({
  id,
  leftBg,
  rightBg,
  left,
  right,
  pinLeft = true,
  desktopReverse = false,
  className = '',
}: SplitScreenSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!pinLeft || !sectionRef.current || !leftRef.current || !rightRef.current) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px)', () => {
      const pin = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        endTrigger: rightRef.current,
        end: 'bottom bottom',
        pin: leftRef.current,
        pinSpacing: false,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          setProgress(Math.round(self.progress * 100));
          if (progressBarRef.current) {
            progressBarRef.current.style.width = `${self.progress * 100}%`;
          }
        },
      });

      return () => pin.kill();
    });

    return () => mm.revert();
  }, [pinLeft]);

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`relative w-full grid grid-cols-1 lg:grid-cols-2 ${className}`}
    >
      {/* Pinned Column (Stacked top on mobile, right on desktop if desktopReverse=true) */}
      <div
        ref={leftRef}
        className={`w-full ${leftBg} min-h-dvh lg:h-dvh flex flex-col justify-between z-10 overflow-hidden relative ${
          desktopReverse ? 'lg:order-2' : ''
        }`}
      >
        {left}

        {/* Desktop Pinned Scroll Progress Indicator Rail */}
        <div className="hidden lg:block absolute bottom-0 left-0 right-0 h-1 bg-neutral-800/30 z-20">
          <div
            ref={progressBarRef}
            className="h-full bg-current transition-all duration-75 ease-out opacity-80"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Content Column (Stacked bottom on mobile, left on desktop if desktopReverse=true) */}
      <div
        ref={rightRef}
        className={`w-full ${rightBg} min-h-dvh flex flex-col justify-between z-0 ${
          desktopReverse ? 'lg:order-1' : ''
        }`}
      >
        {right}
      </div>
    </section>
  );
}
