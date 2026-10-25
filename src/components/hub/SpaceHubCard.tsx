'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';

interface SpaceHubCardProps {
  onChooseDestination: () => void;
  reducedMotion: boolean;
}

export function SpaceHubCard({ onChooseDestination, reducedMotion }: SpaceHubCardProps) {
  return (
    <aside
      aria-label="Contrôle de mission Space Hub"
      className="absolute bottom-3 left-3 right-3 sm:left-auto sm:bottom-6 sm:right-6 md:bottom-8 md:right-10 z-20 flex items-center justify-between sm:justify-start gap-3 md:gap-5 p-3 sm:p-4 md:p-5 rounded-2xl bg-slate-950/85 border border-cyan-500/30 backdrop-blur-xl shadow-[0_0_35px_rgba(6,182,212,0.18)] max-w-full sm:max-w-md select-none transition-all duration-300 hover:border-cyan-400/60"
    >
      {/* Station Hologram Reticle */}
      <div className="relative w-14 h-14 sm:w-18 sm:h-18 md:w-24 md:h-24 flex-shrink-0 flex items-center justify-center">
        {/* Outer Circular Radar Ring */}
        <div
          className={`absolute inset-0 rounded-full border border-cyan-400/40 border-dashed ${
            reducedMotion ? '' : 'animate-[spin_24s_linear_infinite]'
          }`}
        />
        {/* Inner Secondary Reticle Ring */}
        <div className="absolute inset-1 rounded-full border border-cyan-500/30" />
        <div className="absolute inset-2 sm:inset-3 rounded-full border border-cyan-400/20" />

        {/* 4 Cardinal Radar Tick Marks */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-1.5 bg-cyan-400/80" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-1.5 bg-cyan-400/80" />
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-0.5 bg-cyan-400/80" />
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-0.5 bg-cyan-400/80" />

        {/* Space Station Stylized Vector Graphic */}
        <svg
          viewBox="0 0 100 100"
          className="w-9 h-9 sm:w-12 sm:h-12 md:w-16 md:h-16 text-cyan-200 drop-shadow-[0_0_8px_rgba(56,189,248,0.7)]"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Main Module Cylinder */}
          <rect x="44" y="24" width="12" height="52" rx="3" fill="#0f172a" fillOpacity="0.8" />
          <line x1="50" y1="20" x2="50" y2="80" stroke="#38bdf8" strokeWidth="2" />

          {/* Central Hub Ring */}
          <circle cx="50" cy="50" r="10" stroke="#38bdf8" strokeWidth="1.8" />
          <circle cx="50" cy="50" r="4" fill="#38bdf8" />

          {/* Solar Array Truss Wings Left & Right */}
          <line x1="20" y1="50" x2="80" y2="50" stroke="#7dd3fc" strokeWidth="2" />

          {/* Left Solar Panels */}
          <rect x="14" y="38" width="16" height="24" rx="1.5" fill="#0284c7" fillOpacity="0.3" stroke="#38bdf8" />
          <line x1="14" y1="46" x2="30" y2="46" stroke="#38bdf8" strokeWidth="0.8" />
          <line x1="14" y1="54" x2="30" y2="54" stroke="#38bdf8" strokeWidth="0.8" />
          <line x1="22" y1="38" x2="22" y2="62" stroke="#38bdf8" strokeWidth="0.8" />

          {/* Right Solar Panels */}
          <rect x="70" y="38" width="16" height="24" rx="1.5" fill="#0284c7" fillOpacity="0.3" stroke="#38bdf8" />
          <line x1="70" y1="46" x2="86" y2="46" stroke="#38bdf8" strokeWidth="0.8" />
          <line x1="70" y1="54" x2="86" y2="54" stroke="#38bdf8" strokeWidth="0.8" />
          <line x1="78" y1="38" x2="78" y2="62" stroke="#38bdf8" strokeWidth="0.8" />

          {/* Docking ports */}
          <rect x="47" y="18" width="6" height="5" rx="1" fill="#38bdf8" />
          <rect x="47" y="77" width="6" height="5" rx="1" fill="#38bdf8" />
        </svg>
      </div>

      {/* Card Content & Action Button */}
      <div className="flex flex-col items-start gap-0.5 md:gap-1 flex-1 sm:flex-initial">
        <h2 className="text-xs sm:text-sm md:text-base font-bold tracking-[0.2em] sm:tracking-[0.25em] text-white uppercase drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
          SPACE HUB
        </h2>
        <p className="text-[10px] sm:text-[11px] md:text-xs text-slate-300/90 tracking-wide mb-1 sm:mb-2">
          Votre voyage commence ici.
        </p>

        {/* Primary Call To Action Button */}
        <button
          type="button"
          onClick={onChooseDestination}
          className="group relative flex items-center justify-center gap-1.5 md:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 md:px-5 md:py-2.5 rounded-full bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-600 text-white font-semibold text-[10px] sm:text-xs tracking-[0.12em] sm:tracking-[0.16em] uppercase shadow-[0_0_20px_rgba(14,165,233,0.5)] hover:shadow-[0_0_30px_rgba(6,182,212,0.8)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 whitespace-nowrap"
        >
          <span>CHOISIR UNE DESTINATION</span>
          <ArrowRight className="w-3 md:w-3.5 h-3 md:h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
    </aside>
  );
}
