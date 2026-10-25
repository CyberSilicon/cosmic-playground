'use client';

import React, { useEffect } from 'react';
import { X, Rocket, Gauge, Thermometer, Wind, Orbit, Info, Layers, ShieldCheck } from 'lucide-react';
import { Destination } from '@/data/destinations';

interface PlanetInfoCardProps {
  destination: Destination | null;
  onClose: () => void;
  onTravel: (destination: Destination) => void;
}

export function PlanetInfoCard({
  destination,
  onClose,
  onTravel,
}: PlanetInfoCardProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!destination) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="planet-card-title"
      className="absolute top-16 left-4 md:top-20 md:left-10 z-30 w-84 md:w-[420px] max-h-[85vh] overflow-y-auto rounded-3xl bg-slate-950/90 border border-cyan-500/40 backdrop-blur-2xl shadow-[0_0_50px_rgba(6,182,212,0.25)] p-5 md:p-6 text-white select-none transition-all duration-300 animate-in fade-in zoom-in-95 custom-scrollbar"
    >
      {/* Header with Title and Close Button */}
      <div className="flex items-start justify-between border-b border-white/10 pb-3 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor]"
              style={{ backgroundColor: destination.colorHex, color: destination.colorHex }}
            />
            <span className="text-[10px] tracking-[0.2em] font-mono uppercase text-cyan-400">
              {destination.categoryLabel}
            </span>
          </div>
          <h2
            id="planet-card-title"
            className="text-xl md:text-2xl font-bold tracking-[0.2em] uppercase text-white"
          >
            {destination.name}
          </h2>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-full border border-white/15 hover:border-cyan-400 text-slate-400 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          aria-label="Fermer la fiche d'information"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tagline */}
      <p className="text-xs text-slate-300 leading-relaxed mb-4">
        {destination.tagline}
      </p>

      {/* Scientific Planetary Metrics Grid */}
      <div className="grid grid-cols-2 gap-2.5 mb-4 font-mono text-[11px]">
        {/* Gravity */}
        <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/5">
          <Gauge className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <div>
            <div className="text-[9px] text-slate-400 uppercase tracking-wider">Gravité</div>
            <div className="font-semibold text-slate-100">
              {destination.gravityMps2 > 0 ? `${destination.gravityMps2} m/s²` : 'N/A'}
              <span className="text-[9px] text-slate-400 ml-1">
                ({destination.gravityVsEarth} g)
              </span>
            </div>
          </div>
        </div>

        {/* Temperature */}
        <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/5">
          <Thermometer className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <div>
            <div className="text-[9px] text-slate-400 uppercase tracking-wider">Température</div>
            <div className="font-semibold text-slate-100">
              {destination.avgTempCelsius}°C <span className="text-[9px] text-slate-400">(moy.)</span>
            </div>
          </div>
        </div>

        {/* Atmosphere */}
        <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/5 col-span-2">
          <Wind className="w-4 h-4 text-sky-400 flex-shrink-0" />
          <div className="min-w-0">
            <div className="text-[9px] text-slate-400 uppercase tracking-wider">Atmosphère</div>
            <div className="font-semibold text-slate-100 text-[10px] leading-snug">
              {destination.atmosphereSummary}
            </div>
          </div>
        </div>

        {/* Distance from Earth (properly identified as variable) */}
        <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/5 col-span-2">
          <Orbit className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <div>
            <div className="text-[9px] text-slate-400 uppercase tracking-wider">Distance Terre (variable)</div>
            <div className="font-semibold text-slate-100 text-[10px]">
              {destination.distanceFromEarth.minKm} à {destination.distanceFromEarth.maxKm}
            </div>
            <div className="text-[8px] text-slate-400">
              {destination.distanceFromEarth.note}
            </div>
          </div>
        </div>
      </div>

      {/* Known Geological Materials */}
      {destination.knownMaterials && destination.knownMaterials.length > 0 && (
        <div className="mb-4 p-2.5 rounded-xl bg-white/5 border border-white/5">
          <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider text-cyan-300 mb-1.5">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Matériaux & Géologie documentés</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {destination.knownMaterials.map((mat, i) => (
              <span
                key={i}
                className="text-[9px] font-mono px-2 py-0.5 rounded-md bg-cyan-950/60 border border-cyan-800/40 text-cyan-200"
              >
                {mat}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Scientific Source Verification & Texture License Credit */}
      <div className="mb-4 bg-slate-900/60 p-2.5 rounded-xl border border-white/5 text-[9px] text-slate-400 space-y-1">
        <div className="flex items-center gap-1 text-slate-300 font-semibold">
          <ShieldCheck className="w-3 h-3 text-cyan-400 flex-shrink-0" />
          <span>Données scientifiques & Crédits :</span>
        </div>
        <p className="leading-tight">• Source physique : {destination.scientificAttribution}</p>
        <p className="leading-tight">• Texture 3D : Solar System Scope (CC BY 4.0) / NASA JPL</p>
      </div>

      {/* Primary Action Button: VOYAGER */}
      <button
        type="button"
        onClick={() => onTravel(destination)}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-xs tracking-[0.2em] uppercase shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:shadow-[0_0_30px_rgba(6,182,212,0.8)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
      >
        <Rocket className="w-4 h-4" />
        <span>VOYAGER VERS {destination.name.toUpperCase()}</span>
      </button>
    </div>
  );
}
