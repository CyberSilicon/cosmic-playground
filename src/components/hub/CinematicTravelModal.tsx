'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ArrowLeft, Compass, FlaskConical, Database, FastForward } from 'lucide-react';
import { Destination } from '@/data/destinations';
import { ExplorerPanel } from '@/components/travel/ExplorerPanel';
import { MarsLabPanel } from '@/components/travel/MarsLabPanel';
import { ResourcesPanel } from '@/components/travel/ResourcesPanel';
import { CinematicFlightScene } from '@/components/travel/CinematicFlightScene';
import { ArrivalSceneBackdrop, getArrivalSceneMetadata } from '@/components/travel/ArrivalSceneBackdrop';

type TravelPhase = 'idle' | 'flying' | 'arriving' | 'destination';

interface CinematicTravelModalProps {
  destination: Destination | null;
  onClose: () => void;
  reducedMotion: boolean;
}

export function CinematicTravelModal({ destination, onClose, reducedMotion }: CinematicTravelModalProps) {
  const [phase, setPhase] = useState<TravelPhase>('idle');
  const [activeTab, setActiveTab] = useState<'overview' | 'lab' | 'resources'>('overview');
  const [isMobile, setIsMobile] = useState(false);
  const [flightProgress, setFlightProgress] = useState<{ progress: number; phaseLabel: string; speedIndicator: string } | null>(null);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Ignore destination swaps while flying/arriving — blocks double-clicks / mid-flight changes.
  useEffect(() => {
    if (!destination) { setPhase('idle'); setFlightProgress(null); setActiveTab('overview'); return; }
    if (phase === 'flying' || phase === 'arriving' || phase === 'destination') return;
    setActiveTab('overview'); setFlightProgress(null);
    if (reducedMotion) { setPhase('arriving'); return; }
    setPhase('flying');
  }, [destination, phase, reducedMotion]);

  const handleFlightComplete = useCallback(() => setPhase('arriving'), []);
  const handleSkip = useCallback(() => setPhase('arriving'), []);

  // Auto-advance from arrival backdrop to destination UI
  useEffect(() => {
    if (phase !== 'arriving') return;
    const t = setTimeout(() => setPhase('destination'), 1400);
    return () => clearTimeout(t);
  }, [phase]);

  if (!destination) return null;

  const meta = getArrivalSceneMetadata(destination);
  const isFlying = phase === 'flying';
  const isArriving = phase === 'arriving';
  const isDestination = phase === 'destination';

  return (
    <div role="dialog" aria-modal={true} aria-label={`Voyage vers ${destination.name}`} className="fixed inset-0 z-50 flex flex-col bg-black text-white select-none overflow-hidden animate-in fade-in duration-500 font-sans">
      {/* FLYING — 3D cinematic flight (station undock → cruise → orbital approach) */}
      {isFlying && (
        <div className="relative flex-1 flex flex-col items-center justify-center p-6 bg-[#020617] overflow-hidden">
          <CinematicFlightScene destination={destination} isMobile={isMobile} reducedMotion={reducedMotion} onProgressUpdate={setFlightProgress} onFlightComplete={handleFlightComplete} />
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none">
            {flightProgress && (
              <div className="text-center">
                <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-cyan-400">{flightProgress.phaseLabel}</span>
                <div className="w-48 h-1 mt-2 bg-slate-800 rounded-full overflow-hidden border border-white/10">
                  <div className="h-full bg-cyan-400 transition-[width] duration-300" style={{ width: `${flightProgress.progress}%` }} />
                </div>
                <span className="text-[10px] text-slate-400 font-mono mt-1">{flightProgress.speedIndicator} • {flightProgress.progress}%</span>
              </div>
            )}
          </div>
          <button type="button" onClick={handleSkip} className="absolute bottom-8 right-8 z-30 flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 hover:border-cyan-400 text-xs font-mono tracking-widest text-slate-300 hover:text-white transition-all bg-black/40 backdrop-blur-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400">
            <FastForward className='w-4 h-4' /> PASSER L'ANIMATION
          </button>
        </div>
      )}
      {isArriving && (
        <div className="relative flex-1 flex flex-col">
          <ArrivalSceneBackdrop destination={destination} reducedMotion={reducedMotion} isMobile={isMobile} />
        </div>
      )}
      {isDestination && (
        <div className="relative flex-1 flex flex-col overflow-hidden">
          {/* Panoramic / 3D orbital backdrop */}
          {meta.hasDedicatedPanorama && meta.panoramaPath ? (
            <div className="absolute inset-0 z-0">
              <Image src={meta.panoramaPath} alt={`Panorama — ${destination.name}`} fill priority className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 pointer-events-none" />
            </div>
          ) : (
            <div className="absolute inset-0 z-0 bg-[#020617]">
              <div className="absolute inset-0 opacity-25" style={{ backgroundImage: 'url(/assets/planets/starfield.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
            </div>
          )}
          {/* Top Bar */}
          <div className="relative z-10 flex items-center justify-between px-6 py-4 flex-shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-950/70 border border-white/20 hover:border-cyan-400 text-xs font-semibold tracking-[0.18em] uppercase text-white backdrop-blur-xl transition-all shadow-[0_0_20px_rgba(0,0,0,0.5)] focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <ArrowLeft className="w-4 h-4 text-cyan-400" />
              <span>RETOUR STATION HUB</span>
            </button>
            <div className="text-right">
              <span className="text-[10px] font-mono tracking-[0.25em] text-cyan-400 uppercase">DESTINATION ATTEINTE</span>
              <h1 className="text-2xl md:text-3xl font-black tracking-[0.2em] uppercase text-white">{destination.name}</h1>
            </div>
          </div>
          {/* Scrollable zone */}
          <div className="relative z-10 flex-1 overflow-y-auto px-6 pb-8 flex flex-col gap-6">
            {/* HUD Télémétrie */}
            <div className="w-full max-w-sm rounded-2xl bg-slate-950/85 border border-cyan-500/30 backdrop-blur-xl p-5 shadow-[0_0_35px_rgba(6,182,212,0.2)]">
              <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2">
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-cyan-300">TÉLÉMÉTRIE DE SURFACE</span>
                <span className="text-[10px] font-mono text-slate-400">{destination.categoryLabel}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div>
                  <span className="text-[9px] text-slate-400 uppercase block">Gravité locale</span>
                  <span className="font-semibold text-slate-100">{destination.gravityMps2} m/s² ({destination.gravityVsEarth} g)</span>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 uppercase block">Température</span>
                  <span className="font-semibold text-slate-100">{destination.avgTempCelsius}°C</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[9px] text-slate-400 uppercase block">Atmosphère</span>
                  <span className="font-semibold text-slate-100 text-[11px] truncate block">{destination.atmosphereSummary}</span>
                </div>
              </div>
              {destination.scientificNotes && (
                <p className="mt-3 text-[11px] text-slate-300/80 leading-relaxed border-t border-white/5 pt-2">{destination.scientificNotes}</p>
              )}
            </div>
            {/* Tab Buttons */}
            <div className="flex flex-wrap gap-3" role="tablist" aria-label="Sections disponibles">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'overview'}
                onClick={() => setActiveTab('overview')}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-xs font-bold tracking-[0.18em] uppercase transition-all backdrop-blur-md focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${activeTab === 'overview' ? 'bg-cyan-500 border-cyan-400 text-slate-950 shadow-[0_0_25px_rgba(6,182,212,0.7)]' : 'bg-black/60 border-white/20 text-white hover:border-cyan-400'}`}
              >
                <Compass className="w-4 h-4" />
                <span>EXPLORER LA SURFACE</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'lab'}
                onClick={() => setActiveTab('lab')}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-xs font-bold tracking-[0.18em] uppercase transition-all backdrop-blur-md focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${activeTab === 'lab' ? 'bg-cyan-500 border-cyan-400 text-slate-950 shadow-[0_0_25px_rgba(6,182,212,0.7)]' : 'bg-black/60 border-white/20 text-white hover:border-cyan-400'}`}
              >
                <FlaskConical className="w-4 h-4" />
                <span>LABORATOIRE</span>
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'resources'}
                onClick={() => setActiveTab('resources')}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-xs font-bold tracking-[0.18em] uppercase transition-all backdrop-blur-md focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${activeTab === 'resources' ? 'bg-cyan-500 border-cyan-400 text-slate-950 shadow-[0_0_25px_rgba(6,182,212,0.7)]' : 'bg-black/60 border-white/20 text-white hover:border-cyan-400'}`}
              >
                <Database className="w-4 h-4" />
                <span>RESSOURCES</span>
              </button>
            </div>
            {/* Tab Panel Content */}
            <div className="rounded-2xl bg-slate-950/80 border border-white/10 backdrop-blur-xl p-5 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
              {activeTab === 'overview' && <ExplorerPanel destination={destination} reducedMotion={reducedMotion} />}
              {activeTab === 'lab' && <MarsLabPanel destination={destination} reducedMotion={reducedMotion} />}
              {activeTab === 'resources' && <ResourcesPanel destination={destination} />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}