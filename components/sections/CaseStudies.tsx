'use client';

import React, { useRef, useState, useEffect } from 'react';

const CASE_STUDIES = [
  { title: 'Art Installation HUT Astra 65 at Menara Astra & AMDI Building', preview: '/images/event/art-installation-hut-astra-65.jpg', tags: ['Event Organizer'] },
  { title: 'Break Out Day Festival by Djarum', preview: '/images/event/break-out-day-festival-djarum-2024.jpg', tags: ['Event Organizer'] },
  { title: 'Campaign Activation Flip 2023', preview: '/images/event/campaign-activation-flip-2023.jpg', tags: ['Event Organizer'] },
  { title: 'Ed Sheeran Divide World Tour 2019 Gelora Bung Karno Stadium Jakarta', preview: '/images/event/ed-sheeran-divide-world-tour-2019.jpg', tags: ['Event Organizer'] },
  { title: 'Esmod Jakarta Creative Show 2023', preview: '/images/event/esmod-jakarta-creative-show-2023.jpg', tags: ['Event Organizer'] },
  { title: 'Godrej Pekan Raya Jakarta 2023', preview: '/images/event/godrej-prj-2023.gif', tags: ['Event Organizer'] },
  { title: 'Grand Opening Premium Guest House OCBC 2024', preview: '/images/event/grand-opening-ocbc-2024.jpg', tags: ['Event Organizer'] },
  { title: 'HSBC 2025 Summit', preview: '/images/event/hsbc-2025-summit.jpg', tags: ['Event Organizer'] },
  { title: 'HSBC Iftar', preview: '/images/event/hsbc-iftar.jpg', tags: ['Event Organizer'] },
  { title: 'Java Jazz Festival 2017', preview: '/images/event/java-jazz-festival-2017.png', tags: ['Event Organizer'] },
  { title: 'Joyland Festival 2019', preview: '/images/event/joyland-festival-2019.jpg', tags: ['Event Organizer'] },
  { title: 'Synchronize Fest 2019', preview: '/images/event/synchronize-fest-2019.jpg', tags: ['Event Organizer'] },
  { title: 'OCBC Intimate Dinner 2024', preview: '/images/event/ocbc-intimate-dinner-2024.jpg', tags: ['Event Organizer'] },
  { title: 'OLX Indonesia at Indonesia E-Commerce Summit Expo 2017', preview: '/images/event/olx-indo-iese-2017.png', tags: ['Event Organizer'] },
  { title: 'Pokemon Press Conference 2025', preview: '/images/event/pokemon-press-conference-2025.jpg', tags: ['Event Organizer'] },
  { title: 'Menara Astra 2022', preview: '/images/event/ramadan-art-installation-menara-astra-2022.png', tags: ['Ramadhan Art Installation'] },
  { title: 'Road To MotoGP Mandalika 2024', preview: '/images/event/road-to-motogp-mandalika-2024.jpeg', tags: ['Event Organizer'] },
  { title: 'Road To Summit Concept, HSBC 2024', preview: '/images/event/road-to-summit-concept-hsbc-2024.jpg', tags: ['Event Organizer', 'Tenant'] },
];

export default function CaseStudies() {
  const sectionRef = useRef<HTMLElement>(null);
  const lastMousePos = useRef<{ x: number; y: number } | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [previewStyle, setPreviewStyle] = useState<{ top: number; left: number }>({ top: 0, left: 0 });

  const updatePreviewPosition = (element: HTMLElement) => {
    if (!sectionRef.current) return;
    const secRect = sectionRef.current.getBoundingClientRect();
    const itemRect = element.getBoundingClientRect();
    
    // Horizontal centering relative to the section
    const secWidth = secRect.width;
    const desiredCenter = secWidth * 0.65; // Position it slightly more to the right so it doesn't overlap titles
    const centerX = Math.max(secWidth * 0.4, Math.min(secWidth * 0.75, desiredCenter));
    
    // Vertical centering relative to the section
    const itemMidY = (itemRect.top - secRect.top) + itemRect.height / 2;
    
    setPreviewStyle({ top: itemMidY, left: centerX });
  };

  const handleMouseEnter = (index: number, event: React.MouseEvent<HTMLLIElement>) => {
    setHoveredIndex(index);
    updatePreviewPosition(event.currentTarget);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      lastMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleScroll = () => {
      if (!lastMousePos.current) return;
      const el = document.elementFromPoint(lastMousePos.current.x, lastMousePos.current.y);
      if (!el) return;

      const itemLi = el.closest('li[data-case-index]');
      if (itemLi) {
        const idx = Number(itemLi.getAttribute('data-case-index'));
        if (!isNaN(idx)) {
          setHoveredIndex(idx);
          updatePreviewPosition(itemLi as HTMLElement);
        }
      } else {
        const sectionEl = el.closest('#case-studies');
        if (!sectionEl) {
          setHoveredIndex(null);
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section id="case-studies" ref={sectionRef} className="relative w-full py-20 bg-white text-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <h2 className="text-4xl md:text-5xl font-serif font-semibold tracking-tight uppercase text-black mb-12 hover:tracking-wider transition-all duration-300">CASE STUDIES</h2>
        
        <ul className="flex flex-col m-0 p-0 border-t border-neutral-200">
          {CASE_STUDIES.map((cs, idx) => (
            <li
              key={idx}
              data-case-index={idx}
              className="group relative flex flex-col md:grid md:grid-cols-[auto_1fr_auto] items-start md:items-center gap-4 md:gap-8 py-8 md:py-12 border-b border-neutral-200 cursor-pointer transition-all duration-500 hover:bg-transparent md:hover:pl-8"
              onMouseEnter={(e) => handleMouseEnter(idx, e)}
              onMouseLeave={handleMouseLeave}
            >
              {/* Image for mobile (hidden on md and up) */}
              <div className="w-full md:hidden mb-4 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cs.preview} alt={cs.title} className="w-full h-auto rounded-xl shadow-md" />
              </div>

              <div className="flex items-center gap-4 md:gap-8 w-full md:w-auto">
                <span className="font-serif font-bold text-3xl md:text-5xl text-neutral-300 group-hover:text-black transition-colors duration-300">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <h3 className="text-2xl md:text-4xl font-serif font-semibold leading-tight text-neutral-600 group-hover:text-black md:group-hover:translate-x-4 transition-all duration-500 max-w-2xl">
                  {cs.title}
                </h3>
              </div>

              <ul className="flex flex-wrap gap-2 md:col-start-3 md:row-start-1 mt-2 md:mt-0">
                {cs.tags.map((tag, tIdx) => (
                  <li
                    key={tIdx}
                    className="text-[11px] sm:text-xs font-lato font-bold uppercase tracking-wider text-neutral-600 border border-neutral-200 rounded-full px-4 py-1.5 transition-all duration-300 group-hover:bg-black group-hover:text-white group-hover:border-black"
                  >
                    {tag}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>

      {/* Floating preview for desktop */}
      <div
        className={`hidden md:grid absolute pointer-events-none z-30 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] place-items-center ${
          hoveredIndex !== null ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        style={{
          top: `${previewStyle.top}px`,
          left: `${previewStyle.left}px`,
          width: 'min(560px, 42vw)',
          transform: 'translate(-50%, -50%)',
        }}
      >
        {CASE_STUDIES.map((cs, idx) => (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            key={idx}
            src={cs.preview}
            alt={cs.title}
            style={{ gridArea: '1 / 1 / 2 / 2' }}
            className={`w-full h-auto rounded-xl shadow-2xl transition-opacity duration-300 object-contain ${
              hoveredIndex === idx ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
