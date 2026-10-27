'use client';
import React from 'react';
import type { UniverseCatalogDestination, UniverseCategory } from "@/data/universe-catalog";
export interface UniverseMapOverviewProps {
  items: UniverseCatalogDestination[];
  activeCategory: UniverseCategory;
  selectedDestination: UniverseCatalogDestination | null;
  onSelect: (destination: UniverseCatalogDestination) => void;
  isMobile: boolean;
}
export function UniverseMapOverview({ items, selectedDestination, onSelect }: UniverseMapOverviewProps) {
  return <div className="h-full overflow-y-auto px-4 pb-12 pt-24 md:px-10 md:pt-12">
    <div className="mx-auto grid max-w-7xl grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {items.map((world) => <button type="button" key={world.id} onClick={() => onSelect(world)}
        aria-pressed={selectedDestination?.id === world.id}
        className="group overflow-hidden rounded-2xl border border-white/10 bg-slate-900/80 p-4 text-left transition-all hover:border-cyan-400/60 hover:bg-slate-800/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400">
        <div className="mb-3 flex aspect-square items-center justify-center overflow-hidden rounded-xl bg-black">
          <img src={world.texturePath} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" onError={(e) => { e.currentTarget.style.visibility='hidden'; }} />
        </div>
        <h3 className="text-sm font-bold text-white">{world.name}</h3>
        <p className="mt-1 line-clamp-2 text-xs text-slate-400">{world.tagline}</p>
        <p className="mt-3 text-[10px] uppercase tracking-wider text-cyan-300">{world.experienceType === 'surface' ? 'Surface' : 'Observation'} · {world.surfaceStatus === 'artist_concept' ? 'Artistique' : 'Données disponibles'}</p>
      </button>)}
    </div>
    {items.length === 0 && <p className="py-20 text-center text-slate-400">Aucune destination correspondante.</p>}
  </div>;
}
