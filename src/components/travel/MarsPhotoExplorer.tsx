'use client';

import React, { useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, Camera, Info } from 'lucide-react';

// Primary NASA/JPL source records. Download and resize locally for production performance.
const NASA_VIEWS = [
  {
    title: 'Broom Point — Jezero',
    image: 'https://d2pn8kiwq2w21t.cloudfront.net/original_images/PIA26755.png',
    source: 'https://www.jpl.nasa.gov/images/pia26755-nasas-perseverance-rover-provides-sweeping-view-of-broom-point/',
    credit: 'NASA/JPL-Caltech/ASU/MSSS',
    details: 'Photographie Mastcam-Z prise par Perseverance le 15 mai 2025. Panorama réel, pas un décor 3D.',
  },
  {
    title: 'Crocodile Bridge — Jezero',
    image: 'https://d2pn8kiwq2w21t.cloudfront.net/original_images/PIA26699.png',
    source: 'https://www.jpl.nasa.gov/images/pia26699-nasas-perseverance-mars-rover-surveys-crocodile-bridge/',
    credit: 'NASA/JPL-Caltech/ASU/MSSS',
    details: 'Panorama composé de prises Mastcam-Z entre décembre 2025 et janvier 2026.',
  },
] as const;

export function MarsPhotoExplorer() {
  const [index,setIndex] = useState(0);
  const [imgError,setImgError] = useState(false);
  const photo = NASA_VIEWS[index];
  const change = (delta: number) => {
    setIndex((prev) => (prev + delta + NASA_VIEWS.length) % NASA_VIEWS.length);
    setImgError(false);
  };
  return (
    <section aria-label="Paysages photographiés par NASA sur Mars" className="space-y-3">
      <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#2d1b16] min-h-[260px] h-[min(48vw,470px)]">
        {!imgError ? (
          <img key={photo.image} src={photo.image} alt={photo.title} onError={() => setImgError(true)}
            className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-[url('/assets/scenes/panorama-mars.webp')] bg-cover bg-center">
            <p className="bg-black/80 p-3 text-sm text-white">Photo NASA momentanément indisponible. Fond artistique de secours.</p>
          </div>
        )}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute left-4 bottom-4 right-4 flex items-end justify-between gap-3">
          <div className="space-y-1"><p className="text-xs tracking-widest text-cyan-300 uppercase">Image de mission réelle</p><h3 className="text-lg font-semibold text-white">{photo.title}</h3><p className="text-xs text-slate-300">{photo.credit}</p></div>
          <div className="flex gap-2"><button onClick={() => change(-1)} aria-label="Photo précédente" className="rounded-full border border-white/30 bg-black/60 p-3 hover:bg-slate-700"><ChevronLeft size={18}/></button><button onClick={() => change(1)} aria-label="Photo suivante" className="rounded-full border border-white/30 bg-black/60 p-3 hover:bg-slate-700"><ChevronRight size={18}/></button></div>
        </div>
      </div>
      <p className="flex items-start gap-2 text-sm text-slate-300"><Info className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />{photo.details}</p>
      <p className="text-xs text-amber-200">Ces images sont de vrais panoramas pris par des rovers, mais ne sont PAS des surfaces 3D navigables. Le mode terrain 3D reste séparé. Pour un déplacement géographiquement fidèle, utiliser un MNT/DEM NASA/HiRISE.</p>
      <a href={photo.source} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 px-4 py-2 text-xs font-semibold text-cyan-200 hover:bg-cyan-500/15"><Camera size={16}/> Voir la source originale NASA/JPL <ArrowUpRight size={14}/></a>
    </section>
  );
}
