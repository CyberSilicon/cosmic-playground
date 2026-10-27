'use client';

import React, { useCallback, useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, ChevronLeft, ChevronRight, ExternalLink, Image as ImageIcon, Info } from 'lucide-react';
import type { Destination } from '@/data/destinations';
import type { SpacePhoto } from '@/data/space-photos';
import { getPhotosForDestination } from '@/data/space-photos';

interface PhotographicExplorerProps {
  destination: Destination;
  onClose: () => void;
}

export function PhotographicExplorer({ destination, onClose }: PhotographicExplorerProps) {
  const photos = getPhotosForDestination(destination.id);
  const [index, setIndex] = useState(0);
  const [errorIndex, setErrorIndex] = useState<number | null>(null);
  const photo = photos[index];
  const isCartographic = photo.type === 'cartographic';

  const next = useCallback(() => setIndex((i) => (i + 1) % photos.length), [photos.length]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + photos.length) % photos.length), [photos.length]);

  const handleImgError = () => {
    setErrorIndex(index);
  };

  if (!photo) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Exploration photographique — ${destination.name}`}
      className="fixed inset-0 z-50 flex flex-col bg-black text-white select-none"
    >
      <header className="flex items-center justify-between px-6 py-4 z-20 bg-black/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: destination.colorHex }} />
          <h1 className="text-sm font-bold tracking-[0.2em] uppercase text-white">{destination.name}</h1>
          <span className="text-[10px] tracking-widest text-slate-500 font-mono uppercase">
            {isCartographic ? 'Carte de référence' : 'Photographie de mission'}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-full border border-white/15 hover:border-cyan-400 text-slate-400 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          aria-label="Fermer l'exploration"
        >
          <ArrowLeft className="w-4 h-4" /> Retour au hub
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center relative overflow-hidden bg-[#020617]">
        <div className="relative w-full h-full max-w-[1400px] max-h-[90vh] mx-auto flex items-center justify-center">
          <button
            type="button"
            onClick={prev}
            aria-label="Photo précédente"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full border border-white/20 bg-black/60 hover:bg-black/80 text-white transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="relative group overflow-hidden rounded-xl border border-white/10">
            {!errorIndex ? (
              <Image
                src={photo.image}
                alt={photo.title}
                fill
                sizes="(max-width: 768px) 100vw, 80vw"
                className="object-cover w-full h-full"
                loading="lazy"
                onError={handleImgError}
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-slate-400">
                <ImageIcon className="w-12 h-12 mb-2 opacity-50" />
                <p className="text-xs">Image indisponible</p>
                <button
                  type="button"
                  onClick={() => {
                    setErrorIndex(null);
                    setIndex((i) => (i + 1) % photos.length);
                  }}
                  className="mt-3 text-[10px] underline underline-offset-4 text-cyan-400 hover:text-white"
                >
                  Photo suivante
                </button>
              </div>
            )}
            {photos.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex gap-1.5">
                {photos.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Photo ${i + 1}`}
                    onClick={() => setIndex(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === index ? 'bg-cyan-400' : 'bg-white/20 hover:bg-white/40'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={next}
            aria-label="Photo suivante"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full border border-white/20 bg-black/60 hover:bg-black/80 text-white transition-all opacity-0 group-hover:opacity-100"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </main>

      <footer className="px-6 py-4 z-20 bg-black/80 backdrop-blur-md border-t border-white/5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-lg font-semibold text-white">{photo.title}</p>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed">{photo.description}</p>
            {photo.date && (
              <p className="text-[10px] text-slate-500 mt-1 font-mono">{photo.date}</p>
            )}
          </div>
          <div className="flex flex-col md:flex-row items-end justify-end gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-400 font-mono">
              <span className="text-cyan-400">Crédit :</span>
              <span>{photo.credit}</span>
            </div>
            <a
              href={photo.source}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 rounded px-2 py-1 border border-cyan-500/30 text-cyan-200 hover:bg-cyan-500/10 hover:text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Source NASA/JPL</span>
            </a>
          </div>
        </div>
        {photos.length > 1 && (
          <p className="mt-3 text-[10px] text-slate-500 font-mono text-center">
            {index + 1} / {photos.length} · {isCartographic ? 'Vue cartographique de référence' : 'Photographie réelle de mission spatiale'}
          </p>
        )}
      </footer>
    </div>
  );
}
