'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitScreenSection from '@/components/layout/SplitScreenSection';
import ServiceListItem from '@/components/ui/ServiceListItem';

const SERVICES = [
  {
    index: '01',
    title: 'Executive Strategy & Brand Positioning',
    description: 'Translating high-level corporate vision into cohesive spatial, digital, and interactive brand ecosystems.',
    tags: ['Strategy', 'Positioning', 'Executive Vision'],
  },
  {
    index: '02',
    title: 'Interactive & Spatial Technology',
    description: 'Spearheading WebGL 3D, AR/VR, projection mapping, and real-time interactive installations.',
    tags: ['WebGL/3D', 'Spatial Computing', 'Interactive'],
  },
  {
    index: '03',
    title: 'AI Systems & Workflow Integration',
    description: 'Embedding intelligent automation and generative UI workflows into flagship brand experiences.',
    tags: ['AI Workflows', 'Generative UI', 'Automation'],
  },
  {
    index: '04',
    title: 'Native & Web Platform Architecture',
    description: 'Engineered for resilience: building high-performance Next.js and native digital products at scale.',
    tags: ['Next.js/React', 'Architecture', 'Performance'],
  },
  {
    index: '05',
    title: 'Multidisciplinary Team Leadership',
    description: 'Cultivating, mentoring, and leading top-tier creative engineers and designers under unified direction.',
    tags: ['Leadership', 'Culture', 'Precision Execution'],
  },
];

export default function BespokeServices() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>('.service-item');
      items.forEach((item) => {
        gsap.fromTo(
          item,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const leftContent = (
    <div className="flex flex-col justify-between h-full p-6 sm:p-10 md:p-12 lg:p-16 text-white select-none">
      <div>

        <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif font-semibold tracking-tight leading-none uppercase text-white mb-6 hover:tracking-wider transition-all duration-300">
          EXECUTIVE<br />STUDIO
        </h2>
        <p className="font-lato text-neutral-300 text-sm md:text-base max-w-md font-normal leading-relaxed">
          Guiding multidisciplinary teams to build high-stakes digital, spatial, and interactive masterpieces.
        </p>
      </div>

      {/* Studio Showreel Video */}
      <div className="my-6 sm:my-8 relative w-full aspect-video sm:aspect-[4/3] max-h-[300px] sm:max-h-none rounded-2xl bg-neutral-950 border border-neutral-800 overflow-hidden shadow-2xl group">
        <video
          src="/videos/special20-showreel-1080.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Video Overlay Top Badge */}
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex items-center space-x-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/90">
            SHOWREEL
          </span>
        </div>

        {/* Video Overlay Bottom Label */}
        <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 z-10 flex justify-between items-center text-[10px] font-mono text-white/80 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/5">
          <span>EXECUTIVE REEL</span>
          <span>1080P HD</span>
        </div>
      </div>

      <div className="border-t border-neutral-800 pt-4 flex justify-between items-center text-xs font-lato font-semibold uppercase tracking-wider text-neutral-400">
        <span>CRAFTED WITH PRECISION</span>
        <span>5 CORE DISCIPLINES</span>
      </div>
    </div>
  );

  const rightContent = (
    <div ref={containerRef} className="flex flex-col justify-center p-6 sm:p-10 md:p-16 lg:p-24 space-y-2 sm:space-y-4 bg-white">
      {SERVICES.map((service) => (
        <ServiceListItem key={service.index} {...service} />
      ))}
    </div>
  );

  return (
    <SplitScreenSection
      id="core-expertise"
      leftBg="bg-black"
      rightBg="bg-white"
      left={leftContent}
      right={rightContent}
    />
  );
}
