'use client';

import React from 'react';
import SplitScreenSection from '@/components/layout/SplitScreenSection';
import TeamPortraitGrid from '@/components/ui/TeamPortraitGrid';

const FEATURED_WORKS = [
  {
    num: '01',
    title: 'Global Enterprise Keynote 2024',
    type: 'Flagship Summit',
    client: 'Multinational Tech Enterprise',
    tech: 'Spatial Audio / VVIP Architecture / Live Stream Systems',
    summary:
      'High-stakes international convention and executive summit attended by global dignitaries and Fortune 500 CEOs, executed with zero-tolerance precision.',
    impact: 'Streamed to over 15M global viewers and established an executive design benchmark.',
  },
  {
    num: '02',
    title: 'Next-Gen Experiential Platform',
    type: 'Product Launch & Interactive WebGL',
    client: 'Top-Tier Mobility & Automotive Brand',
    tech: 'Three.js / Shader Systems / Real-Time 3D Projection',
    summary:
      'Massive product unveil combining real-time WebGL graphics, spatial audio, and theatrical hardware control.',
    impact: 'Surpassed 10M+ impressions across digital channels within 24 hours of launch.',
  },
  {
    num: '03',
    title: 'Exclusive Executive Gala',
    type: 'VVIP Awarding Night',
    client: 'Global Financial Group',
    tech: 'Bespoke Spatial Design / Immersive Lighting / Fine Dining',
    summary:
      'An invitation-only gala engineered for board-level stakeholders, curated from arrival protocol to closing performance.',
    impact: 'Elevated client brand equity with a 99% executive satisfaction score.',
  },
  {
    num: '04',
    title: 'Global Creative Tech Festival',
    type: 'Mass Scale Experience',
    client: 'Lead Sponsors & International Promoters',
    tech: 'Mega-Structure Design / Crowd Analytics / Interactive Installations',
    summary:
      'Massive festival engaging tens of thousands of attendees, blending world-class live performance with large-scale interactive art installations.',
    impact: 'Sold out within 2 hours, attracting attendees across Southeast Asia and global capitals.',
  },
];

export default function MeetTheTeam() {
  const leftContent = (
    <div className="flex flex-col justify-between h-full p-6 sm:p-10 md:p-12 lg:p-16 text-white select-none">
      <div>
        <div className="flex items-center space-x-3 mb-6">
          <span className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
          <span className="font-mono text-xs uppercase font-extrabold tracking-widest text-neutral-400">
            04 / CASE STUDIES
          </span>
        </div>
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif font-semibold tracking-tight leading-none uppercase text-white mb-4 hover:tracking-wider transition-all duration-300">
          SELECTED<br />MASTERPIECES
        </h2>
        <p className="font-lato text-neutral-300 text-sm md:text-base max-w-md font-normal leading-relaxed">
          A curated selection of flagship enterprise experiences directed under CEO Randy's leadership.
        </p>
      </div>

      {/* Grid of Placeholder Project Cards */}
      <div className="my-6 w-full">
        <TeamPortraitGrid />
      </div>

      <div className="border-t border-neutral-800 pt-4 flex justify-between items-center text-xs font-mono text-neutral-400">
        <span>SPOTLIGHT CASE STUDIES</span>
        <span>4 FEATURED WORKS</span>
      </div>
    </div>
  );

  const rightContent = (
    <div className="flex flex-col justify-center min-h-dvh p-6 sm:p-10 md:p-16 lg:p-24 space-y-8 sm:space-y-12 bg-white">
      {FEATURED_WORKS.map((work) => (
        <div
          key={work.num}
          className="group pb-10 border-b border-neutral-200 last:border-0 last:pb-0 space-y-4"
        >
          <div className="flex justify-between items-baseline">
            <span className="font-lato font-bold text-black text-xs sm:text-sm uppercase tracking-wider">
              CASE STUDY [{work.num}]
            </span>
            <span className="text-xs uppercase font-lato px-3 py-1 bg-black text-white rounded-full font-bold tracking-wider">
              {work.type}
            </span>
          </div>

          <h3 className="text-2xl md:text-4xl font-serif font-semibold text-black group-hover:opacity-70 transition-opacity">
            {work.title}
          </h3>

          <p className="font-lato text-black/80 text-base md:text-lg leading-relaxed font-normal">
            {work.summary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-lato pt-2 text-neutral-500">
            <div>
              <span className="block text-black font-bold mb-0.5">CATEGORY</span>
              <span>{work.client}</span>
            </div>
            <div>
              <span className="block text-black font-bold mb-0.5">KEY ELEMENTS</span>
              <span>{work.tech}</span>
            </div>
          </div>

          <div className="p-4 bg-neutral-100 rounded-xl border border-neutral-200 text-xs md:text-sm font-medium text-neutral-900">
            <strong className="text-black">Strategic Impact: </strong>
            {work.impact}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <SplitScreenSection
      id="selected-masterpieces"
      leftBg="bg-black"
      rightBg="bg-white"
      left={leftContent}
      right={rightContent}
    />
  );
}
