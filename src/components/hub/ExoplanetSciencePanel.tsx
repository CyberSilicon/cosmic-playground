'use client';
import React from 'react';
import { X, ExternalLink } from 'lucide-react';
import type { UniverseCatalogDestination } from "@/data/universe-catalog";
export function ExoplanetSciencePanel({ destination, onClose, isOpen }: {destination: UniverseCatalogDestination; onClose:()=>void; isOpen:boolean}) {
  if (!isOpen) return null;
  return <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={destination.name}>
    <div className="absolute bottom-0 right-0 top-0 w-full max-w-xl overflow-y-auto border-l border-cyan-500/30 bg-slate-950 p-6 shadow-2xl">
      <div className="flex items-start justify-between gap-5"><div><p className="text-xs uppercase tracking-widest text-cyan-300">Dossier scientifique</p><h2 className="mt-2 text-3xl font-bold text-white">{destination.name}</h2><p className="mt-2 text-sm text-slate-300">{destination.tagline}</p></div><button aria-label="Fermer" onClick={onClose} className="rounded-full border border-white/20 p-2 text-white"><X/></button></div>
      <div className="mt-7 space-y-5 text-sm text-slate-300">
        <p>Type d'observation : {destination.surfaceStatus === 'artist_concept' ? 'Illustration artistique — conditions de surface non observées directement' : destination.surfaceStatus}</p>
        <p>Distance depuis la Terre : {destination.distanceToEarth.average} (indicative)</p>
        <p>Sources scientifiques : {destination.scientificAttribution}</p>
        {([['Observé / mesuré', destination.scienceTiers?.observed],['Déduit des modèles', destination.scienceTiers?.deduced],['Hypothèses', destination.scienceTiers?.hypothetical]] as const).map(([label, facts]) => facts?.length ? <section key={label}><h3 className="mb-2 font-semibold text-cyan-200">{label}</h3><ul className="list-disc space-y-1 pl-5">{facts.map((s,i) => <li key={i}>{s}</li>)}</ul></section>:null)}
        {destination.scientificNotes && <p className="rounded-xl border border-white/10 p-4">{destination.scientificNotes}</p>}
      </div>
    </div>
  </div>;
}
