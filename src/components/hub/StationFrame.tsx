'use client';

import React from 'react';
import Image from 'next/image';

interface StationFrameProps {
  children?: React.ReactNode;
}

export function StationFrame({ children }: StationFrameProps) {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-black select-none font-sans">
      {/* Background Plate: Hub Orbital Station & Earth Panorama */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/assets/scenes/hub-orbital.webp"
          alt="Hub Spatial Orbital — Vue panoramique sur la Terre et le Système Solaire"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[0%_53%] pointer-events-none"
        />

        {/* Subtle Atmospheric Depth Tint */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/35 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/30 pointer-events-none" />
      </div>

      {/* Astronaut Character on Foreground Deck observing the cosmos */}
      <div className="absolute left-[16.5%] bottom-0 z-10 pointer-events-none h-[66%] max-h-[500px] w-auto aspect-[140/318]">
        <Image
          src="/assets/scenes/astronaut_suit.png"
          alt="Astronaute observant le cosmos depuis la baie vitrée"
          fill
          priority
          className="object-contain object-bottom drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)]"
        />
      </div>

      {/* Futuristic Station Metal Column Typography (Left Edge) */}
      <div className="absolute left-6 md:left-9 top-[27%] z-20 pointer-events-none hidden sm:flex flex-col items-start tracking-[0.3em] text-[10px] md:text-xs font-semibold text-slate-300/85 drop-shadow-[0_0_12px_rgba(255,255,255,0.45)]">
        <span className="py-1 hover:text-white transition-colors">EXPLORE</span>
        <span className="py-1 hover:text-white transition-colors">DISCOVER</span>
        <span className="py-1 hover:text-white transition-colors">EXPERIMENT</span>
        <div className="w-9 h-[2px] bg-gradient-to-r from-cyan-400 to-transparent mt-2 shadow-[0_0_10px_rgba(6,182,212,0.9)]" />
      </div>

      {/* Discrete Scientific Scale & Attribution Badge (Bottom Left) */}
      <div className="absolute bottom-3 left-6 z-20 pointer-events-none flex items-center gap-2 text-[10px] tracking-wider text-slate-400/80 font-mono bg-black/50 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        <span>Vue illustrative — non à l&apos;échelle astronomique</span>
      </div>

      {/* Interactive Content Layers */}
      {children}
    </div>
  );
}
