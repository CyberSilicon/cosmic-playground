'use client';

import React from 'react';
import { User, Eye } from 'lucide-react';

interface NavigationBarProps {
  currentTab: 'solar-system' | 'explore';
  onSelectTab: (tab: 'solar-system' | 'explore') => void;
  onOpenProfile: () => void;
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
}

export function NavigationBar({
  currentTab,
  onSelectTab,
  onOpenProfile,
  reducedMotion,
  onToggleReducedMotion,
}: NavigationBarProps) {
  return (
    <header className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 md:top-6 md:right-8 z-30 flex items-center gap-1.5 sm:gap-2 select-none max-w-[calc(100vw-1.25rem)]">
      {/* Quick accessibility toggle for reduced motion */}
      <button
        type="button"
        onClick={onToggleReducedMotion}
        title={reducedMotion ? 'Activer animations' : 'Mode animations réduites'}
        className={`p-1.5 sm:p-2 rounded-full border transition-all ${
          reducedMotion
            ? 'bg-amber-500/20 border-amber-400 text-amber-300'
            : 'bg-black/40 border-white/10 text-slate-400 hover:text-white hover:border-white/30'
        } backdrop-blur-md focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 flex-shrink-0`}
        aria-label="Basculer les animations réduites"
      >
        <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
      </button>

      {/* Main Glass Navigation Bar */}
      <nav
        aria-label="Navigation principale du Space Hub"
        className="flex items-center gap-1 sm:gap-2 md:gap-4 px-2.5 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 rounded-full bg-slate-950/80 border border-white/10 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.5)] text-[9px] sm:text-xs md:text-sm font-semibold tracking-[0.12em] sm:tracking-[0.16em] md:tracking-[0.2em] uppercase text-slate-300 overflow-x-auto"
      >
        <button
          type="button"
          onClick={() => onSelectTab('solar-system')}
          className={`relative px-1 sm:px-2 py-0.5 md:py-1 transition-colors rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 whitespace-nowrap ${
            currentTab === 'solar-system'
              ? 'text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]'
              : 'hover:text-white'
          }`}
        >
          <span>SYSTÈME SOLAIRE</span>
          {currentTab === 'solar-system' && (
            <span className="absolute bottom-0 left-0.5 right-0.5 md:left-2 md:right-2 h-[2px] bg-cyan-400 rounded-full shadow-[0_0_6px_rgba(6,182,212,1)]" />
          )}
        </button>

        <span className="text-slate-600 select-none">|</span>

        <button
          type="button"
          onClick={() => onSelectTab('explore')}
          className={`relative px-1 sm:px-2 py-0.5 md:py-1 transition-colors rounded-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 whitespace-nowrap ${
            currentTab === 'explore'
              ? 'text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]'
              : 'hover:text-white'
          }`}
        >
          <span>EXPLORER</span>
          {currentTab === 'explore' && (
            <span className="absolute bottom-0 left-0.5 right-0.5 md:left-2 md:right-2 h-[2px] bg-cyan-400 rounded-full shadow-[0_0_6px_rgba(6,182,212,1)]" />
          )}
        </button>

        <span className="text-slate-600 select-none hidden sm:inline">|</span>

        {/* Profile User Icon */}
        <button
          type="button"
          onClick={onOpenProfile}
          className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center border border-white/20 hover:border-cyan-400 text-slate-300 hover:text-white transition-all bg-white/5 hover:bg-cyan-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 flex-shrink-0"
          aria-label="Profil et Préférences"
        >
          <User className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5" />
        </button>
      </nav>
    </header>
  );
}
