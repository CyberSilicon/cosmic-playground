'use client';

import React from 'react';
import Image from 'next/image';
import { Gauge, Orbit, Thermometer, Info, ExternalLink } from 'lucide-react';
import { Destination } from '@/data/destinations';
import { getPrimaryPhoto } from '@/data/space-photos';

interface ExplorerPanelProps {
  destination: Destination;
  reducedMotion?: boolean;
}

/**
 * ExplorerPanel — Fiche d'identité légère d'une destination.
 *
 * Affiche la photographie principale (ou carte de référence) avec les
 * crédits, ainsi que quelques données scientifiques clés. Aucun onglet
 * laboratoire, aucune expérience interactive, aucune télémétrie.
 */
export function ExplorerPanel({ destination, reducedMotion }: ExplorerPanelProps) {
  const photo = getPrimaryPhoto(destination.id);
  const isCartographic = photo?.type === 'cartographic';

  return (
    <section className="rounded-2xl border border-white/10 bg-slate-950/90 backdrop-blur-xl p-5 md:p-6 text-white">
      <div className="relative overflow-hidden rounded-xl border border-white/10 mb-4 bg-slate-900 aspect-video">
        {photo ? (
          <Image
            src={photo.image}
            alt={photo.title}
            fill
            sizes="(max-width: 768px) 100vw, 600px"
            className="object-cover"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-900 text-slate-600">
            <span className="text-[10px] font-mono uppercase">Aucune image disponible</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-2 left-2 right-2 flex justify-between items-end px-3 py-2">
          <span className="text-[10px] font-bold tracking-widest uppercase text-white">
            {isCartographic ? 'CARTE DE RÉFÉRENCE' : 'PHOTOGRAPHIE DE MISSION'}
          </span>
          <span className="text-[10px] text-slate-300 font-mono">{photo?.credit}</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-xl font-bold tracking-[0.16em] uppercase text-white">{destination.name}</h2>
          <span
            className="text-[10px] tracking-widest font-mono uppercase px-2 py-0.5 rounded-md border"
            style={{
              borderColor: destination.colorHex + '60',
              color: destination.colorHex,
              backgroundColor: destination.colorHex + '15',
            }}
          >
            {destination.categoryLabel}
          </span>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed">{destination.tagline}</p>

        {/* Key metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
            <Gauge className="w-4 h-4 text-cyan-400 flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-[9px] text-slate-400 uppercase tracking-wider">Gravité</div>
              <div className="font-semibold text-slate-100 text-[11px]">
                {destination.gravityMps2 > 0 ? `${destination.gravityMps2} m/s²` : 'N/A'}
              </div>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-[9px] text-slate-400 uppercase tracking-wider">Température moy.</div>
              <div className="font-semibold text-slate-100 text-[11px]">{destination.avgTempCelsius}°C</div>
            </div>
          </div>
          <div className="col-span-2 p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
            <Orbit className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-[9px] text-slate-400 uppercase tracking-wider">Distance Terre (variable)</div>
              <div className="font-semibold text-slate-100 text-[11px] truncate">
                {destination.distanceFromEarth.minKm} à {destination.distanceFromEarth.maxKm}
              </div>
              <div className="text-[9px] text-slate-500 italic">{destination.distanceFromEarth.note}</div>
            </div>
          </div>
        </div>

        {/* Atmosphere */}
        {destination.hasAtmosphere && (
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-sky-500/20 flex items-center justify-center text-sky-400">
              <Info className="w-2.5 h-2.5" />
            </div>
            <div className="min-w-0">
              <div className="text-[9px] text-slate-400 uppercase tracking-wider">Atmosphère</div>
              <div className="font-semibold text-slate-100 text-[11px] leading-snug">{destination.atmosphereSummary}</div>
            </div>
          </div>
        )}

        {/* Source */}
        <div className="mt-3 pt-2 border-t border-white/5 flex items-start gap-2 text-[9px] text-slate-500 font-mono">
          <span className="flex items-center gap-1">
            <ExternalLink className="w-3 h-3" />
            Source : {destination.scientificAttribution}
          </span>
        </div>
      </div>
    </section>
  );
}
