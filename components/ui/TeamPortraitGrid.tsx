'use client';

import React from 'react';

const PROJECTS = [
  {
    id: '01',
    title: 'AURA FLUIDS',
    category: 'Interactive WebGL',
    gradient: 'from-amber-400 via-rose-500 to-indigo-600',
    year: '2025',
  },
  {
    id: '02',
    title: 'CYBER ARCHIVE',
    category: 'Spatial Design & AR',
    gradient: 'from-cyan-400 via-teal-500 to-emerald-600',
    year: '2024',
  },
  {
    id: '03',
    title: 'KINETIC ENGINE',
    category: '3D Simulation App',
    gradient: 'from-purple-500 via-indigo-600 to-blue-700',
    year: '2024',
  },
  {
    id: '04',
    title: 'NEON MATRIX',
    category: 'Interactive Sound Visualizer',
    gradient: 'from-fuchsia-500 via-pink-500 to-rose-600',
    year: '2023',
  },
];

export default function TeamPortraitGrid() {
  return (
    <div className="grid grid-cols-2 gap-4 w-full p-4 md:p-8">
      {PROJECTS.map((item) => (
        <div
          key={item.id}
          className="group relative aspect-square rounded-2xl overflow-hidden bg-sky-950 border border-sky-400/30 flex flex-col justify-between p-4 md:p-6 transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl hover:border-white"
        >
          {/* Abstract Geometric Placeholder Background */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-40 group-hover:opacity-80 transition-opacity duration-500 mix-blend-screen`}
          />

          {/* Grid lines overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

          {/* Top Badge */}
          <div className="relative z-10 flex justify-between items-center text-xs font-mono font-bold text-white/90">
            <span className="px-2.5 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/20">
              PROJECT [{item.id}]
            </span>
            <span className="px-2 py-0.5 bg-sky-900/60 rounded text-sky-200">
              {item.year}
            </span>
          </div>

          {/* Center Graphic Placeholder Icon */}
          <div className="relative z-10 self-center text-white/30 group-hover:text-white group-hover:scale-110 transition-all duration-500">
            <svg
              className="w-12 h-12 md:w-16 md:h-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
          </div>

          {/* Bottom Card Content */}
          <div className="relative z-10 text-white">
            <span className="text-[10px] md:text-xs uppercase font-mono tracking-widest text-sky-200 block mb-1">
              {item.category}
            </span>
            <h4 className="text-base md:text-xl font-extrabold tracking-tight leading-tight group-hover:text-amber-300 transition-colors">
              {item.title}
            </h4>
          </div>
        </div>
      ))}
    </div>
  );
}
