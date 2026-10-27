'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MapPin, ChevronRight, Info, AlertTriangle } from 'lucide-react';
import { Destination } from '@/data/destinations';

interface PointOfInterest {
  id: string;
  name: string;
  icon: string;
  shortDesc: string;
  longDesc: string;
  source: string;
}

const POI_DATA: Record<string, PointOfInterest[]> = {
  mars: [
    {
      id: 'olympus-mons',
      name: 'Olympus Mons',
      icon: '🌋',
      shortDesc: 'Le plus grand volcan du système solaire',
      longDesc:
        "Olympus Mons est un bouclier volcanique de 21,9 km de hauteur (soit ~2,5× l'Everest) et ~600 km de diamètre. Sa caldera sommitale mesure 80 km de large. Âgé de plusieurs centaines de millions d'années, il est considéré géologiquement inactif mais potentiellement dormant.",
      source: 'NASA Mars Global Surveyor / MOLA',
    },
    {
      id: 'valles-marineris',
      name: 'Valles Marineris',
      icon: '🏔️',
      shortDesc: 'Système de canyons long de 4 000 km',
      longDesc:
        "Valles Marineris est le plus long système de canyons du système solaire, s'étendant sur ~4 000 km de long, jusqu'à 200 km de large et 7 km de profondeur. Formé par tectonique et érosion, il révèle des couches géologiques vieilles de milliards d'années.",
      source: 'NASA Viking / Mars Reconnaissance Orbiter',
    },
    {
      id: 'polar-caps',
      name: 'Calottes Polaires',
      icon: '🧊',
      shortDesc: "Réservoirs mixtes de glace d'eau et CO₂",
      longDesc:
        "Les calottes polaires martiennes sont composées d'un noyau permanent de glace d'eau recouvert d'une couche saisonnière de CO₂ gelé. La calotte nord (Planum Boreum) est dominée par la glace d'eau ; la calotte sud (Planum Australe) conserve du CO₂ solide toute l'année.",
      source: 'NASA SHARAD / Mars Climate Sounder',
    },
    {
      id: 'gale-crater',
      name: 'Cratère de Gale',
      icon: '🔭',
      shortDesc: "Site d'atterrissage de Curiosity (2012)",
      longDesc:
        "Le cratère de Gale (155 km de diamètre) abrite une montagne centrale de 5,5 km : Aeolis Mons (Mont Sharp). Curiosity y analyse des couches sédimentaires révélant une histoire lacustre ancienne. Les analyses minéralogiques ont confirmé la présence d'argiles et de sulfates compatibles avec un environnement habitable passé.",
      source: 'NASA / JPL — Curiosity rover, mission Mars Science Laboratory (2012–présent)',
    },
    {
      id: 'jezero-crater',
      name: 'Cratère Jezero',
      icon: '🚀',
      shortDesc: "Delta fluviatile fossile — site de Perseverance",
      longDesc:
        "Jezero était un lac il y a ~3,5 milliards d'années, alimenté par une rivière dont le delta reste parfaitement préservé. Perseverance y prélève des carottes de roche depuis 2021 dans le cadre de Mars Sample Return, à la recherche de biosignatures potentielles.",
      source: 'NASA / JPL — Perseverance rover & MOXIE experiment (2021–présent)',
    },
  ],
  europa: [
    {
      id: 'chaos-terrain',
      name: 'Terrain Chaotique',
      icon: '🌊',
      shortDesc: 'Régions de glace fracturée et reformée',
      longDesc:
        "Le terrain chaotique d'Europe est formé de blocs de glace déplacés et reformés par l'activité de l'océan sous-glaciaire. Conam Macula est l'exemple le plus étudié. Ces régions suggèrent des échanges actifs entre la surface et l'océan profond sous-jacent.",
      source: 'NASA / JPL — Mission Galileo (1995–2003)',
    },
    {
      id: 'linea-ridges',
      name: 'Linea (Rides linéaires)',
      icon: '📏',
      shortDesc: 'Réseaux de crêtes et fractures colorées',
      longDesc:
        "Les linea sont des crêtes et sillons rouge-brun qui strient la surface d'Europe sur des milliers de kilomètres. Leur couleur provient probablement de sels (sulfate de magnésium, chlorure de sodium) remontés de l'océan intérieur. Certaines linea sont récentes, indiquant une activité géologique continue.",
      source: 'NASA / JPL / Galileo SSI — Astrogeology USGS',
    },
    {
      id: 'pwyll-crater',
      name: 'Cratère Pwyll',
      icon: '⭕',
      shortDesc: 'Cratère d\'impact jeune avec éjectas blancs',
      longDesc:
        "Pwyll est l'un des cratères d'impact les plus frais d'Europe (~26 km de diamètre). Ses éjectas rayonnants, d'une blancheur éclatante, contrastent avec la surface teintée. Leur jeunesse géologique (quelques millions d'années) confirme que la surface d'Europe est parmi les plus jeunes du système jovien.",
      source: 'NASA Galileo Mission — USGS Astrogeology Science Center',
    },
    {
      id: 'ocean-floor',
      name: "Fond Océanique (hypothétique)",
      icon: '🌡️',
      shortDesc: "Activité hydrothermale suspectée sous 20 km de glace",
      longDesc:
        "L'océan d'Europe (profondeur estimée 60–150 km) repose sur un fond rocheux où des cheminées hydrothermales analogues aux fumeurs noirs terrestres pourraient exister. Cette hypothèse repose sur la modélisation des flux de chaleur de marée de Jupiter. La mission Europa Clipper (NASA, 2030) cherchera à le confirmer.",
      source:
        'Modèles thermiques JPL / Robert Pappalardo et al. — Europa Clipper Science Team (NASA)',
    },
  ],
  titan: [
    {
      id: 'kraken-mare',
      name: 'Kraken Mare',
      icon: '🌊',
      shortDesc: 'La plus grande mer de méthane liquide de Titan',
      longDesc:
        "Kraken Mare couvre une superficie d'environ 400 000 km² (plus grand que la mer Caspienne), contenant du méthane et de l'éthane liquides à -179°C. Les données radar de Cassini indiquent des profondeurs de plusieurs centaines de mètres. La mission Dragonfly (NASA, 2034) explorera Titan.",
      source: 'NASA / ESA / ASI — Mission Cassini-Huygens, instrument RADAR',
    },
    {
      id: 'titan-dunes',
      name: 'Dunes de Titan',
      icon: '🏜️',
      shortDesc: "Immenses dunes d'hydrocarbures organiques",
      longDesc:
        "Les dunes équatoriales de Titan s'étendent sur des milliers de kilomètres, composées de grains d'hydrocarbures organiques (tholins) de teinte sombre. Hautes de ~100 m et larges de ~1 km, elles sont sculptées par les vents de marée induits par Saturne. Leur composition riche en molécules organiques est unique dans le système solaire.",
      source: 'NASA / ESA Cassini — instruments SAR, VIMS, CIRS',
    },
    {
      id: 'huygens-site',
      name: 'Site Huygens',
      icon: '🛸',
      shortDesc: "Point d'atterrissage de la sonde Huygens (2005)",
      longDesc:
        "La sonde Huygens (ESA) s'est posée sur Titan le 14 janvier 2005, transmettant 72 minutes de données depuis la surface. Elle a photographié des galets arrondis d'eau glacée, confirmant un écoulement fluvial passé. La surface se révèle être constituée d'une argile molle d'hydrocarbures.",
      source: 'ESA / NASA — Mission Cassini-Huygens, sonde atmosphérique Huygens (2005)',
    },
    {
      id: 'methane-lakes',
      name: 'Lacs Polaires Nord',
      icon: '💧',
      shortDesc: "Lacs et rivières de méthane au pôle nord",
      longDesc:
        "Le pôle nord de Titan concentre la majorité des lacs d'hydrocarbures liquides (méthane, éthane, propane). Des rivières les alimentent lors des saisons pluvieuses de méthane. Ligeia Mare et Punga Mare en sont les plus grands exemples, offrant un cycle hydrologique extraterrestre unique.",
      source: 'NASA / ESA / ASI Cassini — données RADAR et VIMS (2004–2017)',
    },
  ],
  saturn: [
    {
      id: 'ring-system',
      name: "Système d'Anneaux",
      icon: '💍',
      shortDesc: 'Anneaux de glace sur 282 000 km',
      longDesc:
        "Les anneaux de Saturne s'étendent sur 282 000 km de rayon externe, mais leur épaisseur moyenne est de seulement 10 m à 1 km. Composés à 99% de glace d'eau pure, ils contiennent aussi des traces de poussière rocheuse. L'anneau principal (B) est le plus dense. Leur âge estimé varie de 10 à 100 millions d'années selon les modèles récents.",
      source: 'NASA Cassini Grand Finale (2017) — Science vol. 364',
    },
    {
      id: 'hexagonal-storm',
      name: 'Hexagone Polaire Nord',
      icon: '🔷',
      shortDesc: 'Vortex atmosphérique hexagonal permanent',
      longDesc:
        "Un vortex hexagonal stable (~29 000 km de côté) entoure le pôle nord de Saturne depuis au moins 1981 (découverte Voyager). Il est maintenu par des ondes d'interférence atmosphériques à 77°N. La sonde Cassini a révélé sa teinte or puis cyan, due aux saisons saturnienne.",
      source: 'NASA / JPL Cassini VIMS, ISS — A. Sánchez-Lavega et al.',
    },
    {
      id: 'great-white-spot',
      name: 'Grande Tache Blanche',
      icon: '⛈️',
      shortDesc: 'Tempête cyclique récurrente tous les 29 ans',
      longDesc:
        "Périodiquement (tous les ~29 ans, soit un an saturnien), une gigantesque tempête blanche éclate dans l'atmosphère de Saturne. La dernière grande tempête (2010-2011) a été observée par Cassini : elle a encerclé toute la planète et éjecté des panaches d'ammoniac. Ces perturbations convectives sont liées aux saisons.",
      source: "NASA / ESA Cassini ISS — Observatoire de la côte d'Azur / A. Sánchez-Lavega",
    },
  ],
  moon: [
    {
      id: 'apollo-11-site',
      name: 'Mer de la Tranquillité (Apollo 11)',
      icon: '🚀',
      shortDesc: "Premier site d'alunissage humain (1969)",
      longDesc:
        "Mare Tranquillitatis est le site historique où Neil Armstrong et Buzz Aldrin se sont posés le 20 juillet 1969. Le réflecteur laser ALSEP déposé est encore actif aujourd'hui, permettant de mesurer la distance Terre-Lune au centimètre près. La région est une plaine basaltique ancienne de ~4 milliards d'années.",
      source: "NASA Apollo 11 / Lunar Reconnaissance Orbiter Camera (LROC)",
    },
    {
      id: 'shackleton-crater',
      name: 'Cratère Shackleton',
      icon: '🧊',
      shortDesc: 'Réservoir permanent de glace au pôle sud',
      longDesc:
        "Le cratère Shackleton (21 km de diamètre, 4,2 km de profondeur) au pôle sud lunaire n'est jamais éclairé par le Soleil depuis des milliards d'années. Des instruments LRO ont confirmé la présence de glace d'eau dans son fond. Il est une cible prioritaire pour les futures missions habitées Artemis.",
      source: 'NASA LRO / Mini-RF radar — Spudis et al. (2010)',
    },
    {
      id: 'tycho-crater',
      name: 'Cratère Tycho',
      icon: '⭕',
      shortDesc: "Cratère d'impact bien préservé avec pic central",
      longDesc:
        "Tycho (85 km de diamètre) est l'un des cratères d'impact les plus jeunes de la Lune (~108 millions d'années). Son pic central (2 km de haut) fut photographié en détail par LRO. Ses rayons brillants s'étendent sur 1 500 km et sont visibles à l'œil nu depuis la Terre.",
      source: 'NASA LRO LROC — Lunar & Planetary Institute',
    },
    {
      id: 'oceanus-procellarum',
      name: "Océan des Tempêtes",
      icon: '🌑',
      shortDesc: 'La plus grande mer lunaire (~2 500 km)',
      longDesc:
        "Oceanus Procellarum couvre 2,5 millions km² de basaltes volcaniques sombres. Il a été formé par d'intenses épanchements volcaniques il y a 1,2 à 3,5 milliards d'années. Des anomalies gravitationnelles détectées par GRAIL indiquent un réseau de rifts thermiques enfouis sous la surface.",
      source: 'NASA GRAIL / Kiefer et al. — Lunar Prospector',
    },
  ],
};

const PANORAMA_MAP: Record<string, string> = {
  europa: '/assets/scenes/panorama-europa.webp',
  titan: '/assets/scenes/panorama-titan.webp',
};

const PANORAMA_LABELS: Record<string, string> = {
  titan: 'Illustration artistique — Conditions simulées',
  europa: 'Vue composite depuis données Galileo',
};

interface ExplorerPanelProps {
  destination: Destination;
  reducedMotion: boolean;
}

export function ExplorerPanel({ destination, reducedMotion }: ExplorerPanelProps) {
  const [selectedPoi, setSelectedPoi] = useState<PointOfInterest | null>(null);

  const pois = POI_DATA[destination.id] || null;
  const sceneBg = PANORAMA_MAP[destination.id] || null;
  const panoramaLabel = PANORAMA_LABELS[destination.id] || null;

  const isGasGiant =
    destination.category === 'gas_giant' || destination.category === 'ice_giant';

  return (
    <div className="flex flex-col gap-6">
      {/* Panorama banner */}
      {sceneBg ? <div className="relative w-full h-40 rounded-xl overflow-hidden">
        <Image
          src={sceneBg}
          alt={`Panorama de surface — ${destination.name}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 700px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <div className="absolute bottom-3 left-4 flex flex-col gap-1">
          <span className="text-xs font-bold tracking-widest uppercase text-cyan-300">
            Surface — {destination.name}
          </span>
          {panoramaLabel && (
            <span className="text-[10px] text-amber-300 font-mono flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> {panoramaLabel}
            </span>
          )}
        </div>
        <span className="absolute bottom-3 right-4 text-[9px] text-slate-400 font-mono italic">
          Vue illustrative — non à l&apos;échelle
        </span>
      </div> : <div className="relative w-full h-40 rounded-xl overflow-hidden bg-slate-950/90 flex items-center justify-center text-sm text-slate-400">Aucun panorama photographique vérifié disponible pour {destination.name}</div>}

      {isGasGiant ? (
        <div className="rounded-xl bg-amber-900/20 border border-amber-500/30 p-5 text-center">
          <AlertTriangle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-amber-300 mb-1">Observation Atmosphérique Uniquement</p>
          <p className="text-xs text-slate-400 leading-relaxed">
            {destination.name} est une géante gazeuse/de glace sans surface solide accessible. Les
            données d&apos;exploration sont limitées aux observations atmosphériques depuis orbite.
          </p>
        </div>
      ) : pois ? (
        <div className="flex flex-col md:flex-row gap-4">
          {/* POI list */}
          <div className="flex flex-col gap-2 md:w-64 flex-shrink-0">
            <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-cyan-400 mb-1">
              Points d&apos;intérêt
            </h3>
            {pois.map((poi) => (
              <button
                key={poi.id}
                type="button"
                onClick={() => setSelectedPoi(poi.id === selectedPoi?.id ? null : poi)}
                aria-pressed={poi.id === selectedPoi?.id}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                  poi.id === selectedPoi?.id
                    ? 'bg-cyan-500/20 border-cyan-400/60 text-white'
                    : 'bg-slate-900/60 border-white/10 text-slate-300 hover:border-cyan-500/40 hover:text-white'
                } ${reducedMotion ? '' : 'duration-200'}`}
              >
                <span className="text-xl leading-none" aria-hidden="true">{poi.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate">{poi.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{poi.shortDesc}</p>
                </div>
                <ChevronRight
                  className={`w-3 h-3 flex-shrink-0 transition-transform ${
                    poi.id === selectedPoi?.id ? 'rotate-90 text-cyan-400' : 'text-slate-600'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* POI detail */}
          <div className="flex-1">
            {selectedPoi ? (
              <div className="rounded-xl bg-slate-900/70 border border-cyan-500/20 p-5 h-full flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl" aria-hidden="true">{selectedPoi.icon}</span>
                  <div>
                    <h4 className="text-sm font-bold text-white">{selectedPoi.name}</h4>
                    <p className="text-[10px] text-cyan-400 font-mono">{selectedPoi.shortDesc}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed flex-1">
                  {selectedPoi.longDesc}
                </p>
                <div className="flex items-start gap-2 pt-2 border-t border-white/5">
                  <Info className="w-3 h-3 text-slate-500 flex-shrink-0 mt-0.5" />
                  <p className="text-[10px] text-slate-500 italic">{selectedPoi.source}</p>
                </div>
              </div>
            ) : (
              <div className="rounded-xl bg-slate-900/40 border border-white/5 p-5 h-full flex flex-col items-center justify-center gap-2 text-center">
                <MapPin className="w-8 h-8 text-slate-600" />
                <p className="text-xs text-slate-500">
                  Sélectionnez un point d&apos;intérêt pour afficher les détails scientifiques.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="rounded-xl bg-slate-900/60 border border-white/10 p-8 text-center flex flex-col items-center gap-3">
          <MapPin className="w-10 h-10 text-slate-600" />
          <p className="text-sm font-semibold text-slate-400">
            Données d&apos;exploration non disponibles
          </p>
          <p className="text-xs text-slate-500 max-w-sm">
            Mission à définir — Aucune donnée de terrain cartographiée pour {destination.name} dans
            la base de données actuelle.
          </p>
        </div>
      )}
    </div>
  );
}
