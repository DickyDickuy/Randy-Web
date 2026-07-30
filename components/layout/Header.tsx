'use client';

import React, { useState, useRef, useEffect } from 'react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { label: 'VISION', href: '#about-me' },
    { label: 'CAPABILITIES', href: '#core-expertise' },
    { label: 'ETHOS', href: '#the-journey' },
    { label: 'WORKS', href: '#selected-masterpieces' },
    { label: 'CONTACT', href: '#contact' },
  ];

  return (
    <header
      ref={containerRef}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      className="fixed top-6 right-6 sm:top-8 sm:right-12 z-50 flex flex-col items-end mix-blend-difference text-white select-none pointer-events-auto"
    >
      {/* Menu Trigger Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Toggle Menu"
        className="flex items-center space-x-1.5 cursor-pointer font-mono text-sm sm:text-base font-extrabold uppercase tracking-widest hover:opacity-70 transition-opacity p-2 -m-2"
      >
        <span>MENU</span>
        <span className={`transition-transform duration-300 text-xs sm:text-sm ${isOpen ? 'rotate-45' : 'rotate-0'}`}>
          ❖
        </span>
      </button>

      {/* Expanded Hover/Click Dropdown Links (noth.in Minimalist Style) */}
      <nav
        className={`flex flex-col items-end pt-3 space-y-1 sm:space-y-1.5 transition-all duration-300 ease-out origin-top-right ${
          isOpen
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
        }`}
      >
        {navLinks.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setIsOpen(false)}
            className="font-mono text-xs sm:text-sm font-black uppercase tracking-wider text-right text-white hover:opacity-50 transition-opacity py-0.5 block"
          >
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
