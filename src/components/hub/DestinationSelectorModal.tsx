'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { X, Search, ChevronRight, Gauge, Orbit, Sparkles, ShieldCheck } from 'lucide-react';
import { ALL_DESTINATIONS, Destination } from '@/data/destinations';

interface DestinationSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDestination: (dest: Destination) => void;
}

export function DestinationSelectorModal({
  isOpen,
  onClose,
  onSelectDestination,
}: DestinationSelectorModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'terrestrial' | 'giant' | 'moon' | 'dwarf'>('all');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredDestinations = useMemo(() => {
    return ALL_DESTINATIONS.filter((dest) => {
      const matchesSearch =
        dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (activeFilter === 'terrestrial') {
        return dest.category === 'terrestrial';
      }
      if (activeFilter === 'giant') {
        return dest.category === 'gas_giant' || dest.category === 'ice_giant' || dest.category === 'star';
      }
      if (activeFilter === 'moon') {
        return dest.category === 'moon' || dest.category === 'ocean_world';
      }
      if (activeFilter === 'dwarf') {
        return dest.category === 'dwarf';
      }
      return true;
    });
  }, [searchQuery, activeFilter]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="selector-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-8 bg-black/85 backdrop-blur-xl animate-in fade-in select-none"
    >
      <div className="relative w-full max-w-5xl max-h-[90vh] flex flex-col rounded-3xl bg-slate-950/95 border border-cyan-500/40 shadow-[0_0_60px_rgba(6,182,212,0.25)] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 md:p-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-[11px] font-mono tracking-[0.25em] text-cyan-400 uppercase">
                CATALOGUE SCIENTIFIQUE DU SYSTÈME SOLAIRE ({ALL_DESTINATIONS.length} CORPS)
              </span>
            </div>
            <h2 id="selector-modal-title" className="text-xl md:text-2xl font-bold tracking-[0.18em] text-white uppercase">
              Choisir une destination céleste
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full border border-white/15 hover:border-cyan-400 text-slate-400 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            aria-label="Fermer le sélecteur"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="p-4 md:p-6 border-b border-white/10 flex flex-col md:flex-row gap-4 items-center justify-between bg-white/[0.02]">
          {/* Search Bar */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher Mars, Encelade, Pluton, Triton..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 text-xs tracking-wider focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto text-[11px] font-mono tracking-wider pb-1 md:pb-0">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-lg border whitespace-nowrap transition-all ${
                activeFilter === 'all'
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              TOUS ({ALL_DESTINATIONS.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('terrestrial')}
              className={`px-3 py-1.5 rounded-lg border whitespace-nowrap transition-all ${
                activeFilter === 'terrestrial'
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              PLANÈTES TELLURIQUES
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('giant')}
              className={`px-3 py-1.5 rounded-lg border whitespace-nowrap transition-all ${
                activeFilter === 'giant'
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              GÉANTES & ÉTOILE
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('moon')}
              className={`px-3 py-1.5 rounded-lg border whitespace-nowrap transition-all ${
                activeFilter === 'moon'
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              LUNES ({ALL_DESTINATIONS.filter(d => d.category === 'moon' || d.category === 'ocean_world').length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('dwarf')}
              className={`px-3 py-1.5 rounded-lg border whitespace-nowrap transition-all ${
                activeFilter === 'dwarf'
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              PLANÈTES NAINES
            </button>
          </div>
        </div>

        {/* Destination Cards Grid */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 custom-scrollbar">
          {filteredDestinations.map((dest) => (
            <div
              key={dest.id}
              className="group relative flex flex-col justify-between p-4 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-cyan-400/60 transition-all duration-300"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-md border"
                    style={{
                      borderColor: dest.colorHex + '60',
                      color: dest.colorHex,
                      backgroundColor: dest.colorHex + '15',
                    }}
                  >
                    {dest.categoryLabel}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    Ø {dest.diameterKm.toLocaleString('fr-FR')} km
                  </span>
                </div>

                {/* Name */}
                <h3 className="text-lg font-bold tracking-[0.16em] uppercase text-white mb-1 group-hover:text-cyan-300 transition-colors">
                  {dest.name}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                  {dest.tagline}
                </p>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-300 mb-3 bg-black/40 p-2.5 rounded-xl border border-white/5">
                  <div className="flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{dest.gravityMps2 > 0 ? `${dest.gravityMps2} m/s²` : 'Excentrique'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Orbit className="w-3.5 h-3.5 text-amber-400" />
                    <span>{dest.avgTempCelsius}°C</span>
                  </div>
                </div>

                {/* Attribution note */}
                <div className="text-[9px] text-slate-500 truncate mb-3">
                  Source : {dest.scientificAttribution}
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => {
                  onSelectDestination(dest);
                  onClose();
                }}
                className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500 text-cyan-300 hover:text-white border border-cyan-500/30 font-mono text-xs tracking-wider transition-all duration-300"
              >
                <span>SÉLECTIONNER & VOIR FICHE</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          ))}
        </div>

        {/* Modal Footer with Texture Credits */}
        <div className="p-4 border-t border-white/10 bg-slate-900/40 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-slate-400 font-mono">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Licence textures : Solar System Scope (CC BY 4.0) & NASA/JPL/USGS Media Guidelines</span>
          </div>
          <span className="text-slate-500">Distances moyennes indicatives — orbites képlériennes variables</span>
        </div>
      </div>
    </div>
  );
}
