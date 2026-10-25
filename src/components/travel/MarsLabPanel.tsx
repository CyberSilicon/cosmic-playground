'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  FlaskConical,
  Atom,
  Layers,
  Wind,
  AlertTriangle,
  Info,
  ChevronRight,
  Footprints,
} from 'lucide-react';
import { Destination } from '@/data/destinations';
import { PlanetaryEVAExplorer } from '@/components/travel/PlanetaryEVAExplorer';

// ─── Types ────────────────────────────────────────────────────────────────────

interface MarsLabPanelProps {
  destination: Destination;
  reducedMotion: boolean;
}

type LabTab = 'gravity' | 'rock' | 'oxygen' | 'eva';

// ─── Constants ────────────────────────────────────────────────────────────────

const PLANET_GRAVITY: Record<string, { label: string; g: number }> = {
  mars: { label: 'Mars', g: 3.71 },
  earth: { label: 'Terre', g: 9.807 },
  moon: { label: 'Lune', g: 1.62 },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

// --- Gravity Experiment ---

function GravityExperiment({ destination }: { destination: Destination }) {
  const [speed, setSpeed] = useState(20);
  const [angle, setAngle] = useState(45);
  const [planet, setPlanet] = useState<'mars' | 'earth' | 'moon'>('mars');
  const canvasRef = useRef<SVGSVGElement>(null);

  const g = PLANET_GRAVITY[planet].g;
  const theta = (angle * Math.PI) / 180;
  const vx = speed * Math.cos(theta);
  const vy = speed * Math.sin(theta);
  const flightTime = (2 * vy) / g;
  const range = vx * flightTime;
  const maxHeight = (vy * vy) / (2 * g);

  // Build SVG trajectory path
  const W = 400;
  const H = 180;
  const margin = 20;
  const plotW = W - margin * 2;
  const plotH = H - margin * 2;

  const points: string[] = [];
  const steps = 60;
  const maxRange = Math.max(range, 1);
  const maxH = Math.max(maxHeight, 1);

  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * flightTime;
    const px = vx * t;
    const py = vy * t - 0.5 * g * t * t;
    const svgX = margin + (px / maxRange) * plotW;
    const svgY = margin + plotH - (py / maxH) * plotH;
    points.push(`${svgX.toFixed(1)},${svgY.toFixed(1)}`);
  }
  const pathD = `M ${points.join(' L ')}`;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-4">
        {/* Controls */}
        <div className="flex flex-col gap-3 flex-1 min-w-48">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-slate-400 block mb-1">
              Vitesse initiale : <span className="text-cyan-300 font-mono">{speed} m/s</span>
            </label>
            <input
              type="range"
              min={1}
              max={50}
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-full accent-cyan-400"
              aria-label="Vitesse initiale"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-slate-400 block mb-1">
              Angle de tir : <span className="text-cyan-300 font-mono">{angle}°</span>
            </label>
            <input
              type="range"
              min={1}
              max={89}
              value={angle}
              onChange={(e) => setAngle(Number(e.target.value))}
              className="w-full accent-cyan-400"
              aria-label="Angle de tir"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-slate-400 block mb-2">
              Corps céleste
            </label>
            <div className="flex gap-2">
              {(Object.keys(PLANET_GRAVITY) as Array<keyof typeof PLANET_GRAVITY>).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPlanet(p as 'mars' | 'earth' | 'moon')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                    planet === p
                      ? 'bg-cyan-500 border-cyan-400 text-slate-950'
                      : 'bg-black/40 border-white/20 text-slate-300 hover:border-cyan-400'
                  }`}
                  aria-pressed={planet === p}
                >
                  {PLANET_GRAVITY[p].label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="grid grid-cols-3 gap-3 flex-1 min-w-48 content-start">
          {[
            { label: 'Temps de vol', value: `${flightTime.toFixed(2)} s` },
            { label: 'Portée', value: `${range.toFixed(1)} m` },
            { label: 'Hauteur max', value: `${maxHeight.toFixed(1)} m` },
          ].map((r) => (
            <div
              key={r.label}
              className="rounded-lg bg-slate-900/60 border border-cyan-500/20 p-3 text-center"
            >
              <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">{r.label}</p>
              <p className="text-sm font-bold font-mono text-cyan-300">{r.value}</p>
            </div>
          ))}
          <div className="col-span-3 text-[9px] text-slate-500 italic leading-snug border-t border-white/5 pt-2">
            g = {g} m/s² ({PLANET_GRAVITY[planet].label}). Modèle sans résistance atmosphérique,
            simplified Newtonian mechanics. v₀²sin(2θ)/g
          </div>
        </div>
      </div>

      {/* SVG Trajectory */}
      <div className="rounded-xl bg-slate-950/60 border border-cyan-500/10 overflow-hidden">
        <svg
          ref={canvasRef}
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          role="img"
          aria-label="Trajectoire balistique"
          className="block"
        >
          {/* Grid lines */}
          <line x1={margin} y1={H - margin} x2={W - margin} y2={H - margin} stroke="#334155" strokeWidth="1" />
          <line x1={margin} y1={margin} x2={margin} y2={H - margin} stroke="#334155" strokeWidth="1" />
          {/* Trajectory */}
          <path d={pathD} fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" />
          {/* Labels */}
          <text x={margin + 4} y={H - margin - 4} fontSize="8" fill="#64748b" fontFamily="monospace">
            0
          </text>
          <text x={W - margin - 2} y={H - margin - 4} fontSize="8" fill="#64748b" fontFamily="monospace" textAnchor="end">
            {range.toFixed(0)}m
          </text>
          <text x={margin + 4} y={margin + 10} fontSize="8" fill="#64748b" fontFamily="monospace">
            {maxHeight.toFixed(0)}m
          </text>
        </svg>
      </div>
    </div>
  );
}

// --- Rock Samples ---

const ROCK_SAMPLES = [
  {
    id: 'basalt',
    name: 'Basalte Volcanique',
    emoji: '🌑',
    color: '#374151',
    composition: 'Riche en silicates mafiques : pyroxène, olivine et plagioclase. Sombre, dense, d\'origine magmatique profonde.',
    context: 'Omniprésent à la surface martienne, formé par le volcanisme il y a 1 à 4 milliards d\'années. Identifié depuis Pathfinder (1997) et confirmé par Spirit/Opportunity.',
    source: 'NASA — Missions Spirit, Opportunity (MER) ; Mars Pathfinder',
    missions: 'Spirit & Opportunity (MER)',
  },
  {
    id: 'hematite',
    name: 'Billes d\'Hématite',
    emoji: '🔴',
    color: '#7f1d1d',
    composition: 'Concrétions sphériques d\'oxyde de fer (Fe₂O₃). Diamètre ~5 mm. Surnommées "Blueberries" par l\'équipe Opportunity.',
    context: 'Découvertes à Meridiani Planum (2004). Leur forme sphérique indique une formation en milieu aqueux (précipitation chimique), confirmant la présence ancienne d\'eau liquide.',
    source: 'NASA — Rover Opportunity (2004), Squyres et al., Science 2004',
    missions: 'Opportunity (MER)',
  },
  {
    id: 'sulfate-clay',
    name: 'Argile Sulfatée',
    emoji: '🏔️',
    color: '#78350f',
    composition: 'Smectites argileuses (phyllosilicates) et sulfates de calcium/magnésium. Formation en milieu aqueux à pH neutre à faiblement acide.',
    context: 'Détectée par Curiosity dans le cratère Gale (mont Sharp). Représente des sédiments lacustres vieux de ~3,5 milliards d\'années, dans un environnement potentiellement habitable.',
    source: 'NASA — Curiosity rover, Grotzinger et al., Science 2014 ; instrument CheMin',
    missions: 'Curiosity MSL, Gale Crater',
  },
  {
    id: 'co2-ice',
    name: 'Glace de CO₂',
    emoji: '🧊',
    color: '#1e3a5f',
    composition: 'Dioxyde de carbone solidifié (point de sublimation : -78,5°C à pression terrestre ; -125°C sous pression martienne). Translucide à blanchâtre.',
    context: 'Constitue la couche saisonnière des calottes polaires. En hiver, jusqu\'à 30% de l\'atmosphère martienne se condense aux pôles. Sa sublimation printanière génère des jets de CO₂ gazeux.',
    source: 'NASA — Mars Climate Sounder (MRO) ; OMEGA (ESA Mars Express)',
    missions: 'Mars Reconnaissance Orbiter, Mars Express',
  },
];

function RockExperiment() {
  const [selected, setSelected] = useState<string | null>(null);
  const selectedSample = ROCK_SAMPLES.find((r) => r.id === selected) || null;

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {ROCK_SAMPLES.map((rock) => (
          <button
            key={rock.id}
            type="button"
            onClick={() => setSelected(rock.id === selected ? null : rock.id)}
            aria-pressed={rock.id === selected}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border text-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
              rock.id === selected
                ? 'border-cyan-400/60 bg-cyan-500/10'
                : 'border-white/10 bg-slate-900/50 hover:border-cyan-500/30'
            }`}
          >
            <span className="text-3xl" aria-hidden="true">{rock.emoji}</span>
            <span className="text-[11px] font-semibold text-slate-200 leading-tight">{rock.name}</span>
            <span className="text-[9px] text-slate-500">{rock.missions}</span>
          </button>
        ))}
      </div>

      {selectedSample ? (
        <div className="rounded-xl border border-cyan-500/20 bg-slate-900/60 p-5 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="text-4xl" aria-hidden="true">{selectedSample.emoji}</span>
            <div>
              <h5 className="text-sm font-bold text-white">{selectedSample.name}</h5>
              <p className="text-[10px] font-mono text-cyan-400">{selectedSample.missions}</p>
            </div>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Composition</p>
            <p className="text-xs text-slate-300 leading-relaxed">{selectedSample.composition}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Contexte de découverte</p>
            <p className="text-xs text-slate-300 leading-relaxed">{selectedSample.context}</p>
          </div>
          <div className="flex items-start gap-2 border-t border-white/5 pt-3">
            <Info className="w-3 h-3 text-slate-500 flex-shrink-0 mt-0.5" />
            <p className="text-[10px] text-slate-500 italic">{selectedSample.source}</p>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-white/5 bg-slate-900/30 p-6 flex flex-col items-center gap-2 text-center">
          <Layers className="w-8 h-8 text-slate-600" />
          <p className="text-xs text-slate-500">Sélectionnez un échantillon pour afficher son analyse.</p>
        </div>
      )}
    </div>
  );
}

// --- MOXIE Oxygen Experiment ---

const MOXIE_STEPS = [
  {
    id: 'intake',
    label: 'Admission CO₂',
    icon: '⬇️',
    color: 'border-sky-500/40 bg-sky-950/30',
    activeColor: 'border-sky-400 bg-sky-900/50',
    detail:
      "L'atmosphère martienne (95,3% CO₂) est aspirée et filtrée par MOXIE. Une pompe à faible pression comprime le gaz pour l'acheminer vers la cellule électrolytique. Débit typique : quelques grammes d'O₂/heure.",
  },
  {
    id: 'electrolysis',
    label: 'Électrolyse (800°C)',
    icon: '⚡',
    color: 'border-orange-500/40 bg-orange-950/30',
    activeColor: 'border-orange-400 bg-orange-900/50',
    detail:
      "La cellule SOXE (Solid Oxide Electrolyzer Cell) à 800°C divise le CO₂ : CO₂ → CO + O²⁻. Les ions oxygène O²⁻ migrent à travers la membrane céramique (zircone yttriée) sous l'effet du champ électrique. Le CO est rejeté côté anodique.",
  },
  {
    id: 'separation',
    label: 'Séparation O₂',
    icon: '🔬',
    color: 'border-emerald-500/40 bg-emerald-950/30',
    activeColor: 'border-emerald-400 bg-emerald-900/50',
    detail:
      "Les ions O²⁻ se recombinent en O₂ moléculaire côté cathodique de la cellule. Un analyseur de gaz (MOXIE Electrolysis Performance Analyzer) vérifie la pureté de l'oxygène produit. Des capteurs de pression et température surveillent en temps réel.",
  },
  {
    id: 'collection',
    label: 'Collecte O₂',
    icon: '🫁',
    color: 'border-violet-500/40 bg-violet-950/30',
    activeColor: 'border-violet-400 bg-violet-900/50',
    detail:
      "L'O₂ pur est récupéré et mesuré. MOXIE a produit jusqu'à 10,44 grammes d'oxygène par heure lors de ses meilleures sessions (2022). À l'échelle industrielle, une version 200× plus grande fournirait assez d'O₂ pour le décollage d'un engin humain depuis Mars.",
  },
];

function OxygenExperiment() {
  const [activeStep, setActiveStep] = useState<string | null>(null);
  const stepData = MOXIE_STEPS.find((s) => s.id === activeStep) || null;

  return (
    <div className="flex flex-col gap-5">
      {/* Warning */}
      <div className="rounded-lg bg-amber-950/40 border border-amber-500/30 p-3 flex gap-2 items-start">
        <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="text-[10px] text-amber-200/80 leading-relaxed">
          <strong>Simulation pédagogique simplifiée</strong> — Non un simulateur thermochimique industriel.
          Basé sur l&apos;expérience MOXIE (NASA, mission Perseverance 2021). Source : NASA JPL MOXIE Team.
        </p>
      </div>

      {/* MOXIE Steps */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {MOXIE_STEPS.map((step, idx) => (
          <button
            key={step.id}
            type="button"
            onClick={() => setActiveStep(step.id === activeStep ? null : step.id)}
            aria-pressed={step.id === activeStep}
            className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border text-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
              step.id === activeStep ? step.activeColor : step.color
            } hover:brightness-110`}
          >
            <span className="text-[10px] font-bold text-slate-400 font-mono">ÉTAPE {idx + 1}</span>
            <span className="text-2xl" aria-hidden="true">{step.icon}</span>
            <span className="text-[11px] font-semibold text-slate-200 leading-tight">{step.label}</span>
            {idx < MOXIE_STEPS.length - 1 && (
              <ChevronRight className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 hidden md:block" />
            )}
          </button>
        ))}
      </div>

      {/* Reaction equation */}
      <div className="rounded-lg bg-slate-900/50 border border-white/10 p-3 text-center">
        <p className="text-xs font-mono text-slate-300">
          CO₂ <span className="text-orange-400">→ [SOXE 800°C]</span> → CO + O²⁻ <span className="text-emerald-400">→</span> <strong className="text-emerald-300">O₂</strong>
        </p>
        <p className="text-[10px] text-slate-500 mt-1">Électrolyse haute température (oxyde solide)</p>
      </div>

      {/* Step detail */}
      {stepData ? (
        <div className="rounded-xl border border-cyan-500/20 bg-slate-900/60 p-5 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl" aria-hidden="true">{stepData.icon}</span>
            <h5 className="text-sm font-bold text-white">{stepData.label}</h5>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">{stepData.detail}</p>
          <div className="flex items-start gap-2 border-t border-white/5 pt-2">
            <Info className="w-3 h-3 text-slate-500 flex-shrink-0 mt-0.5" />
            <p className="text-[10px] text-slate-500 italic">
              Source : NASA JPL — MOXIE Science Team / Hecht et al., Science 2021
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-white/5 bg-slate-900/30 p-5 flex flex-col items-center gap-2 text-center">
          <Wind className="w-8 h-8 text-slate-600" />
          <p className="text-xs text-slate-500">Cliquez sur une étape pour afficher le détail du processus MOXIE.</p>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export function MarsLabPanel({ destination, reducedMotion }: MarsLabPanelProps) {
  const [labTab, setLabTab] = useState<LabTab>('gravity');
  const [evaDestination, setEvaDestination] = useState<Destination | null>(null);

  if (destination.id !== 'mars') {
    return (
      <div className="rounded-xl bg-slate-900/60 border border-white/10 p-8 flex flex-col items-center gap-3 text-center">
        <FlaskConical className="w-10 h-10 text-slate-600" />
        <p className="text-sm font-semibold text-slate-400">Laboratoire Martien</p>
        <p className="text-xs text-slate-500">
          Ce laboratoire est disponible uniquement depuis <strong className="text-orange-400">Mars</strong>.
          Voyagez vers Mars pour accéder aux expériences scientifiques interactives.
        </p>
      </div>
    );
  }

  const LAB_TABS: { id: LabTab; label: string; icon: React.ReactNode }[] = [
    { id: 'gravity', label: 'Gravité', icon: <Atom className="w-3.5 h-3.5" /> },
    { id: 'rock', label: 'Roches', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'oxygen', label: 'MOXIE O₂', icon: <Wind className="w-3.5 h-3.5" /> },
    { id: 'eva', label: 'Exploration 3D', icon: <Footprints className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="flex flex-col gap-5">
      {/* Lab Backdrop */}
      <div className="relative rounded-xl overflow-hidden h-28">
        <Image
          src="/assets/scenes/laboratoire-mars.webp"
          alt="Décor laboratoire martien"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 700px"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center px-6 gap-1">
          <span className="text-[10px] font-mono tracking-[0.25em] text-orange-400 uppercase">
            STATION SCIENTIFIQUE
          </span>
          <h3 className="text-xl font-black tracking-[0.15em] uppercase text-white">
            Laboratoire Mars
          </h3>
          <span className="text-[10px] text-slate-400 font-mono">
            4 expériences interactives disponibles
          </span>
        </div>
      </div>

      {/* Lab Tabs */}
      <div className="flex gap-2 flex-wrap" role="tablist" aria-label="Expériences du laboratoire">
        {LAB_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={labTab === tab.id}
            onClick={() => {
              setEvaDestination(tab.id === 'eva' ? destination : null);
              setLabTab(tab.id);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-xs font-bold uppercase tracking-wider transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 ${
              labTab === tab.id
                ? 'bg-orange-500 border-orange-400 text-slate-950'
                : 'bg-black/40 border-white/20 text-slate-300 hover:border-orange-400/60'
            } ${reducedMotion ? '' : 'duration-200'}`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div role="tabpanel">
        {evaDestination ? (
          <PlanetaryEVAExplorer
            destination={evaDestination}
            onReturn={() => {
              setEvaDestination(null);
              setLabTab('gravity');
            }}
            reducedMotion={reducedMotion}
          />
        ) : (
          <>
            {labTab === 'gravity' && <GravityExperiment destination={destination} />}
            {labTab === 'rock' && <RockExperiment />}
            {labTab === 'oxygen' && <OxygenExperiment />}
          </>
        )}
      </div>
    </div>
  );
}
