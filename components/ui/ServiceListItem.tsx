'use client';

import React from 'react';

interface ServiceListItemProps {
  index: string;
  title: string;
  description: string;
  tags: string[];
}

export default function ServiceListItem({
  index,
  title,
  description,
  tags,
}: ServiceListItemProps) {
  return (
    <div className="service-item group py-8 md:py-12 border-b border-neutral-200 transition-colors duration-500 hover:border-black">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-2 mb-3">
        <span className="text-xs sm:text-sm md:text-base font-lato font-bold text-neutral-400 group-hover:text-black transition-colors duration-300">
          [{index}]
        </span>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] sm:text-xs uppercase font-lato font-bold tracking-wider px-2.5 py-0.5 sm:px-3 sm:py-1 bg-neutral-100 text-neutral-600 rounded-full group-hover:bg-black group-hover:text-white transition-all duration-300"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <h3 className="text-xl sm:text-3xl md:text-5xl font-serif font-semibold text-black tracking-tight mb-3 group-hover:translate-x-1.5 transition-transform duration-300 ease-out leading-tight">
        {title}
      </h3>

      <p className="font-lato text-black/80 text-sm sm:text-base md:text-lg max-w-xl leading-relaxed font-normal">
        {description}
      </p>
    </div>
  );
}
