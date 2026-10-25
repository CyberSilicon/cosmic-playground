'use client';

import React, { useState } from 'react';
import {
  Database,
  ExternalLink,
  Download,
  Info,
  CheckCircle,
} from 'lucide-react';
import { Destination } from '@/data/destinations';

interface ResourcesPanelProps {
  destination: Destination;
}

// ─── Scientific Sources per destination ────────────────────────────────────────

const SCIENTIFIC_LINKS: Record<
  string,
  { label: string; url: string; org: string }[]
> = {
  mars: [
    {
      label: 'NASA Mars Exploration',
      url: 'https://mars.nasa.gov/',
      org: 'NASA',
    },
    {
      label: 'Curiosity Rover — Mission MSL',
      url: 'https://mars.nasa.gov/msl/home/',
      org: 'NASA / JPL',
    },
    {
      label: 'Perseverance & MOXIE',
      url: 'https://mars.nasa.gov/mars2020/',
      org: 'NASA / JPL',
    },
    {
      label: 'Mars Fact Sheet',
      url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html',
      org: 'NASA NSSDC',
    },
  ],
  moon: [
    {
      label: 'Lunar Reconnaissance Orbiter',
      url: 'https://lunar.gsfc.nasa.gov/',
      org: 'NASA',
    },
    {
      label: 'Moon Fact Sheet',
      url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html',
      org: 'NASA NSSDC',
    },
    {
      label: 'Apollo Missions Archive',
      url: 'https://www.nasa.gov/mission_pages/apollo/index.html',
      org: 'NASA',
    },
  ],
  europa: [
    {
      label: 'Europa Clipper Mission',
      url: 'https://europa.nasa.gov/',
      org: 'NASA / JPL',
    },
    {
      label: 'Europa Fact Sheet',
      url: 'https://solarsystem.nasa.gov/moons/jupiter-moons/europa/in-depth/',
      org: 'NASA',
    },
    {
      label: 'Galileo Mission Archive',
      url: 'https://solarsystem.nasa.gov/missions/galileo/overview/',
      org: 'NASA / JPL',
    },
  ],
  titan: [
    {
      label: 'Cassini-Huygens Mission',
      url: 'https://solarsystem.nasa.gov/missions/cassini/overview/',
      org: 'NASA / ESA / ASI',
    },
    {
      label: 'Dragonfly Mission',
      url: 'https://dragonfly.jhuapl.edu/',
      org: 'NASA / APL',
    },
    {
      label: 'Titan Fact Sheet',
      url: 'https://solarsystem.nasa.gov/moons/saturn-moons/titan/in-depth/',
      org: 'NASA',
    },
  ],
  saturn: [
    {
      label: 'Cassini Grand Finale',
      url: 'https://solarsystem.nasa.gov/missions/cassini/mission/grand-finale/overview/',
      org: 'NASA / JPL',
    },
    {
      label: 'Saturn Fact Sheet',
      url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/saturnfact.html',
      org: 'NASA NSSDC',
    },
  ],
  jupiter: [
    {
      label: 'Juno Mission',
      url: 'https://www.nasa.gov/mission_pages/juno/main/index.html',
      org: 'NASA / JPL',
    },
    {
      label: 'Jupiter Fact Sheet',
      url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/jupiterfact.html',
      org: 'NASA NSSDC',
    },
  ],
};

const DEFAULT_LINKS = [
  {
    label: 'NASA Solar System Exploration',
    url: 'https://solarsystem.nasa.gov/',
    org: 'NASA',
  },
  {
    label: 'ESA Science — Planetary Science',
    url: 'https://sci.esa.int/web/planetary-science',
    org: 'ESA',
  },
  {
    label: 'JPL — Jet Propulsion Laboratory',
    url: 'https://www.jpl.nasa.gov/',
    org: 'NASA / JPL',
  },
];

// ─── Component ─────────────────────────────────────────────────────────────────

export function ResourcesPanel({ destination }: ResourcesPanelProps) {
  const [toastVisible, setToastVisible] = useState(false);

  const links = SCIENTIFIC_LINKS[destination.id] || DEFAULT_LINKS;

  const handleFakeDownload = () => {
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Toast */}
      {toastVisible && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl bg-slate-800 border border-cyan-500/40 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
          <CheckCircle className="w-5 h-5 text-cyan-400" />
          <p className="text-xs font-semibold text-white">
            Fiche <strong>{destination.name}</strong> en cours de préparation…
          </p>
        </div>
      )}

      {/* Data Table */}
      <section aria-labelledby="data-section-title">
        <h3
          id="data-section-title"
          className="text-[10px] font-bold tracking-[0.25em] uppercase text-cyan-400 mb-3 flex items-center gap-2"
        >
          <Database className="w-4 h-4" />
          Données Planétaires
        </h3>
        <div className="rounded-xl bg-slate-900/60 border border-white/10 overflow-hidden">
          <table className="w-full text-xs">
            <tbody>
              {[
                { label: 'Nom', value: destination.name },
                { label: 'Catégorie', value: destination.categoryLabel },
                { label: 'Diamètre', value: `${destination.diameterKm.toLocaleString('fr-FR')} km` },
                {
                  label: 'Gravité',
                  value: `${destination.gravityMps2} m/s² (${destination.gravityVsEarth} g)`,
                },
                { label: 'Température moy.', value: `${destination.avgTempCelsius}°C` },
                { label: 'Plage de temp.', value: destination.tempRangeText },
                { label: 'Atmosphère', value: destination.atmosphereSummary },
                { label: 'Durée du jour', value: destination.dayLength },
                { label: 'Durée de l\'année', value: destination.yearLength },
                {
                  label: 'Distance (moy.)',
                  value: destination.distanceFromEarth.averageKm,
                },
              ].map((row, i) => (
                <tr
                  key={row.label}
                  className={i % 2 === 0 ? 'bg-transparent' : 'bg-white/3'}
                >
                  <td className="px-4 py-2.5 text-slate-500 font-medium w-40">{row.label}</td>
                  <td className="px-4 py-2.5 text-slate-200 font-mono">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Atmosphere Composition */}
      {destination.atmosphereComposition.length > 0 &&
        destination.atmosphereComposition[0].gas !== 'Aucun gaz détectable' && (
          <section aria-labelledby="atmo-section-title">
            <h3
              id="atmo-section-title"
              className="text-[10px] font-bold tracking-[0.25em] uppercase text-cyan-400 mb-3"
            >
              Composition Atmosphérique
            </h3>
            <div className="flex flex-col gap-2">
              {destination.atmosphereComposition.map((comp) => (
                <div
                  key={comp.gas}
                  className="flex items-center justify-between px-4 py-2 rounded-lg bg-slate-900/50 border border-white/5"
                >
                  <span className="text-xs text-slate-300">{comp.gas}</span>
                  <span className="text-xs font-mono text-cyan-300 font-bold">
                    {typeof comp.percentage === 'number'
                      ? `${comp.percentage}%`
                      : comp.percentage}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

      {/* Known Materials */}
      {destination.knownMaterials.length > 0 && (
        <section aria-labelledby="materials-section-title">
          <h3
            id="materials-section-title"
            className="text-[10px] font-bold tracking-[0.25em] uppercase text-cyan-400 mb-3"
          >
            Matériaux Identifiés
          </h3>
          <div className="flex flex-wrap gap-2">
            {destination.knownMaterials.map((mat) => (
              <span
                key={mat}
                className="px-3 py-1.5 rounded-full text-[11px] bg-slate-800 border border-white/10 text-slate-300"
              >
                {mat}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Scientific Sources */}
      <section aria-labelledby="sources-section-title">
        <h3
          id="sources-section-title"
          className="text-[10px] font-bold tracking-[0.25em] uppercase text-cyan-400 mb-3"
        >
          Sources Scientifiques Officielles
        </h3>
        <div className="flex flex-col gap-2">
          {links.map((link) => (
            <a
              key={link.url}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-4 py-2.5 rounded-lg bg-slate-900/60 border border-white/10 hover:border-cyan-500/40 transition-colors group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">
                  {link.label}
                </span>
                <span className="text-[10px] text-slate-500">{link.org}</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors flex-shrink-0" />
            </a>
          ))}
        </div>
        <p className="mt-2 text-[10px] text-slate-600 italic flex items-start gap-1.5">
          <Info className="w-3 h-3 flex-shrink-0 mt-0.5" />
          Attribution principale : {destination.scientificAttribution}
        </p>
      </section>

      {/* Texture Credits */}
      <section className="rounded-xl bg-slate-900/40 border border-white/5 p-4">
        <h3 className="text-[10px] font-bold tracking-[0.25em] uppercase text-slate-500 mb-2">
          Crédits Textures
        </h3>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Textures planétaires :{' '}
          <a
            href="https://www.solarsystemscope.com/textures/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-600 hover:text-cyan-400 underline focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400"
          >
            Solar System Scope
          </a>{' '}
          — Licence{' '}
          <a
            href="https://creativecommons.org/licenses/by/4.0/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-600 hover:text-cyan-400 underline focus:outline-none focus-visible:ring-1 focus-visible:ring-cyan-400"
          >
            CC BY 4.0
          </a>
          . Panoramas de surface et illustrations : NASA / JPL-Caltech (domaine public sauf mention contraire).
        </p>
      </section>

      {/* Fake Download */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleFakeDownload}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/20 bg-black/40 text-xs font-semibold text-slate-300 hover:border-cyan-400 hover:text-white transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
        >
          <Download className="w-4 h-4" />
          <span>Télécharger fiche (simulé)</span>
        </button>
      </div>
    </div>
  );
}
