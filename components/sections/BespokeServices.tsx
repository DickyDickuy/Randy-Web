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

        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight leading-none uppercase text-white mb-6">
          EXECUTIVE<br />STUDIO
        </h2>
        <p className="text-neutral-400 text-sm md:text-base max-w-md font-light leading-relaxed">
          Guiding multidisciplinary teams to build high-stakes digital, spatial, and interactive masterpieces.
        </p>
      </div>

      {/* Tech Image Collage Mockup */}
      <div className="my-8 relative w-full aspect-[4/3] rounded-2xl bg-neutral-950 border border-neutral-800 p-4 flex flex-col justify-between overflow-hidden shadow-2xl">
        <div className="flex justify-between items-center z-10">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-neutral-700" />
            <div className="w-3 h-3 rounded-full bg-neutral-700" />
            <div className="w-3 h-3 rounded-full bg-neutral-700" />
          </div>
          <span className="text-[10px] font-mono text-neutral-400">SYSTEM_INITIALIZED</span>
        </div>

        <div className="z-10 space-y-2">
          <div className="h-2 w-3/4 bg-neutral-800 rounded animate-pulse" />
          <div className="h-2 w-1/2 bg-white/60 rounded" />
          <div className="h-2 w-5/6 bg-neutral-800 rounded" />
        </div>

        <div className="flex justify-between items-end z-10 text-[10px] font-mono text-white">
          <span>STATUS: ONLINE</span>
          <span>STRATEGY_ENGINE v1.0</span>
        </div>
      </div>

      <div className="border-t border-neutral-800 pt-4 flex justify-between items-center text-xs font-mono text-neutral-400">
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
