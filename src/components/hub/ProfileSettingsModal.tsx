'use client';

import React, { useEffect } from 'react';
import { X, User, Eye, ShieldCheck, ExternalLink } from 'lucide-react';

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
}

export function ProfileSettingsModal({
  isOpen,
  onClose,
  reducedMotion,
  onToggleReducedMotion,
}: ProfileSettingsModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in select-none"
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-slate-950/95 border border-cyan-500/40 p-6 md:p-8 shadow-[0_0_50px_rgba(6,182,212,0.25)] text-white max-h-[90vh] overflow-y-auto custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 id="profile-modal-title" className="text-lg font-bold tracking-[0.2em] uppercase">
                Profil Astronaute & Préférences
              </h2>
              <span className="text-[11px] font-mono text-cyan-400">
                EXPLORATEUR SCIENTIFIQUE INVITE • ACCÈS COMPLET
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full border border-white/15 hover:border-cyan-400 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Accessibility settings */}
        <div className="space-y-4 mb-6 font-mono text-xs">
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 border border-white/5">
            <div className="flex items-center gap-3">
              <Eye className="w-4 h-4 text-cyan-400" />
              <div>
                <div className="font-semibold text-slate-200">Animations réduites (prefers-reduced-motion)</div>
                <div className="text-[10px] text-slate-400">Réduit ou désactive les rotations et les perles lumineuses</div>
              </div>
            </div>
            <button
              type="button"
              onClick={onToggleReducedMotion}
              className={`px-3 py-1.5 rounded-lg border text-[11px] font-semibold transition-all ${
                reducedMotion
                  ? 'bg-cyan-500 border-cyan-400 text-slate-950 font-bold'
                  : 'bg-white/10 border-white/20 text-slate-300 hover:text-white'
              }`}
            >
              {reducedMotion ? 'ACTIVÉ' : 'DÉSACTIVÉ'}
            </button>
          </div>

          {/* Detailed Scientific Sources and Texture Credits */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 text-[11px] leading-relaxed text-slate-300 space-y-3">
            <div className="flex items-center gap-2 text-cyan-400 font-bold tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>CRÉDITS DES TEXTURES & SOURCES SCIENTIFIQUES</span>
            </div>

            <div className="space-y-2">
              <p>
                • <strong>Solar System Scope (Creative Commons Attribution 4.0 - CC BY 4.0) :</strong><br />
                Textures planétaires 2K (Mercure, Vénus, Terre jour/nuit/nuages, Lune, Mars, Jupiter, Saturne & anneaux, Uranus, Neptune, Soleil).
                <br />
                <a
                  href="https://edu.solarsystemscope.com/textures/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:underline inline-flex items-center gap-1 text-[10px]"
                >
                  edu.solarsystemscope.com/textures <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </p>

              <p>
                • <strong>NASA / JPL-Caltech / USGS Astrogeology :</strong><br />
                Mosaïque d’Europe (Mission Galileo/Voyager), cartographies de Pluton/Charon (New Horizons), Io/Ganymède (Juno/Galileo), Encelade/Titan (Cassini-Huygens), Cérès (Dawn) et Phobos/Déimos (MRO).
              </p>

              <p>
                • <strong>Données astrophysiques :</strong><br />
                NASA Planetary Fact Sheets, JPL Solar System Dynamics. Les distances affichées indiquent les variations périodiques selon les lois de Kepler.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs tracking-[0.2em] uppercase transition-all"
        >
          FERMER LES PARAMÈTRES
        </button>
      </div>
    </div>
  );
}
