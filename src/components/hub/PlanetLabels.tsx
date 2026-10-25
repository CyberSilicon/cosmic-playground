'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { MAIN_DESTINATIONS, Destination } from '@/data/destinations';

interface PlanetLabelsProps {
  selectedId: string | null;
  hoveredId: string | null;
  onSelect: (destination: Destination) => void;
  onHover: (id: string | null) => void;
}

export function PlanetLabels({
  selectedId,
  hoveredId,
  onSelect,
  onHover,
}: PlanetLabelsProps) {
  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {MAIN_DESTINATIONS.map((dest) => {
        const isSelected = selectedId === dest.id;
        const isHovered = hoveredId === dest.id;

        // Position offsets matching CAPTURE_ORIGINALE.png
        let leftPercent = dest.hubPosition.xPercent * 100;
        let topPercent = dest.hubPosition.yPercent * 100;

        if (dest.id === 'saturn') {
          leftPercent -= 9.5;
          topPercent += 6.5;
        } else if (dest.id === 'mars') {
          leftPercent += 5.5;
          topPercent -= 1.0;
        } else if (dest.id === 'moon') {
          leftPercent += 4.5;
          topPercent += 0.5;
        } else if (dest.id === 'europa') {
          leftPercent += 3.8;
          topPercent += 1.0;
        } else if (dest.id === 'titan') {
          leftPercent += 4.0;
          topPercent += 0.5;
        }

        return (
          <button
            key={dest.id}
            type="button"
            onClick={() => onSelect(dest)}
            onPointerEnter={() => onHover(dest.id)}
            onPointerLeave={() => onHover(null)}
            onFocus={() => onHover(dest.id)}
            onBlur={() => onHover(null)}
            style={{
              left: `${leftPercent}%`,
              top: `${topPercent}%`,
            }}
            className={`absolute pointer-events-auto -translate-y-1/2 flex items-center gap-1 md:gap-1.5 px-1.5 py-0.5 sm:px-2 sm:py-1 md:px-2.5 md:py-1 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 group ${
              isSelected
                ? 'bg-slate-900/85 border border-cyan-400/80 shadow-[0_0_15px_rgba(6,182,212,0.6)] scale-110'
                : isHovered
                ? 'bg-slate-900/70 border border-white/40 shadow-[0_0_12px_rgba(255,255,255,0.3)] scale-105'
                : 'bg-black/20 sm:bg-transparent border border-white/5 sm:border-transparent hover:bg-slate-950/40 backdrop-blur-[2px] sm:backdrop-blur-none'
            }`}
            aria-label={`Explorer ${dest.name} (${dest.categoryLabel})`}
          >
            <span
              className={`text-[9px] sm:text-xs md:text-sm font-semibold tracking-[0.16em] sm:tracking-[0.22em] uppercase transition-colors ${
                isSelected
                  ? 'text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]'
                  : isHovered
                  ? 'text-white'
                  : 'text-slate-200/90 drop-shadow-[0_0_6px_rgba(0,0,0,0.8)]'
              }`}
            >
              {dest.name}
            </span>

            {/* Glowing Chevron Circle */}
            <span
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center border transition-all duration-300 ${
                isSelected
                  ? 'border-cyan-400 bg-cyan-500/20 text-cyan-300 shadow-[0_0_8px_rgba(6,182,212,0.6)]'
                  : isHovered
                  ? 'border-white text-white bg-white/10'
                  : 'border-slate-300/50 text-slate-300/80 bg-black/30 group-hover:border-white'
              }`}
            >
              <ChevronRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 transition-transform group-hover:translate-x-0.5" />
            </span>
          </button>
        );
      })}
    </div>
  );
}
