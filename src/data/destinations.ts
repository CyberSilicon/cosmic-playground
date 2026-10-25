export interface Destination {
  id: string;
  name: string;
  nameEn: string;
  category: 'star' | 'terrestrial' | 'moon' | 'ocean_world' | 'gas_giant' | 'ice_giant' | 'dwarf' | 'exoplanet';
  categoryLabel: string;
  tagline: string;
  diameterKm: number;
  gravityMps2: number;
  gravityVsEarth: number;
  avgTempCelsius: number;
  tempRangeText: string;
  hasAtmosphere: boolean;
  atmosphereSummary: string;
  atmosphereComposition: { gas: string; percentage: number | string }[];
  knownMaterials: string[];
  distanceFromEarth: {
    minKm: string;
    maxKm: string;
    averageKm: string;
    note: string;
  };
  dayLength: string;
  yearLength: string;
  scientificAttribution: string;
  scientificNotes: string;
  texturePath: string;
  ringTexturePath?: string;
  colorHex: string;
  glowColor: string;
  trajectoryColor: string;
  hubPosition: {
    xPercent: number;
    yPercent: number;
    baseRadius: number;
  };
  hasRings?: boolean;
  ringsRadius?: { inner: number; outer: number };
  isHubHero: boolean;
  region: 'Système solaire' | 'Voie lactée';
}

export const MAIN_DESTINATIONS: Destination[] = [
  {
    id: 'moon',
    name: 'Lune',
    nameEn: 'Moon',
    category: 'moon',
    categoryLabel: 'Satellite Naturel Terrestre',
    tagline: 'Le berceau de l’exploration humaine au-delà de la Terre',
    diameterKm: 3474,
    gravityMps2: 1.62,
    gravityVsEarth: 0.166,
    avgTempCelsius: -20,
    tempRangeText: '-130°C (nuit) à +120°C (jour)',
    hasAtmosphere: false,
    atmosphereSummary: 'Quasi nulle (exosphère ténue non respirable)',
    atmosphereComposition: [
      { gas: 'Hélium, Néon, Hydrogène, Argon', percentage: '< 0.0001%' }
    ],
    knownMaterials: ['Régolithe basaltique', 'Anorthosite', 'Ilménite (oxyde de titane et fer)', 'Glace piégée aux pôles'],
    distanceFromEarth: {
      minKm: '363 300 km (périgée)',
      maxKm: '405 500 km (apogée)',
      averageKm: '384 400 km',
      note: 'Distance Terre-Lune mesurée avec précision centimétrique par réflecteurs laser Apollo'
    },
    dayLength: '27,3 jours terrestres (rotation synchrone)',
    yearLength: '27,3 jours terrestres',
    scientificAttribution: 'NASA Lunar Reconnaissance Orbiter (LRO) / Solar System Scope',
    scientificNotes: 'Seul astre extraterrestre ayant accueilli des équipages humains (missions Apollo 1969-1972).',
    texturePath: '/assets/planets/moon.jpg',
    colorHex: '#d8dee9',
    glowColor: 'rgba(216, 222, 233, 0.35)',
    trajectoryColor: '#38bdf8',
    hubPosition: { xPercent: 0.272, yPercent: 0.318, baseRadius: 0.62 },
    isHubHero: true,
    region: 'Système solaire'
  },
  {
    id: 'mars',
    name: 'Mars',
    nameEn: 'Mars',
    category: 'terrestrial',
    categoryLabel: 'Planète Tellurique',
    tagline: 'La planète rouge, prochaine frontière de l’humanité',
    diameterKm: 6779,
    gravityMps2: 3.71,
    gravityVsEarth: 0.379,
    avgTempCelsius: -63,
    tempRangeText: '-140°C (nuit polaire) à +20°C (midi équatorial)',
    hasAtmosphere: true,
    atmosphereSummary: 'Atmosphère ténue dominée par le dioxyde de carbone (pression ~610 Pa)',
    atmosphereComposition: [
      { gas: 'Dioxyde de carbone (CO₂)', percentage: 95.32 },
      { gas: 'Azote (N₂)', percentage: 2.6 },
      { gas: 'Argon (Ar)', percentage: 1.9 },
      { gas: 'Oxygène (O₂)', percentage: 0.16 }
    ],
    knownMaterials: ['Oxydes de fer (hématite, rouille)', 'Basalte volcanique', 'Glace d’eau et de CO₂', 'Argiles et sulfates'],
    distanceFromEarth: {
      minKm: '54,6 millions km',
      maxKm: '401 millions km',
      averageKm: '225 millions km',
      note: 'Distance périodiquement variable selon les configurations orbitales (oppositions tous les 26 mois)'
    },
    dayLength: '24 h 37 min 22 s (1 sol)',
    yearLength: '687 jours terrestres (1,88 an)',
    scientificAttribution: 'NASA / JPL Mars Global Surveyor / Solar System Scope',
    scientificNotes: 'Abrite Olympus Mons (22 km de haut) et Valles Marineris (4 000 km de long).',
    texturePath: '/assets/planets/mars.jpg',
    colorHex: '#ff6b4a',
    glowColor: 'rgba(255, 107, 74, 0.45)',
    trajectoryColor: '#fb923c',
    hubPosition: { xPercent: 0.418, yPercent: 0.268, baseRadius: 0.88 },
    isHubHero: true,
    region: 'Système solaire'
  },
  {
    id: 'europa',
    name: 'Europe',
    nameEn: 'Europa',
    category: 'ocean_world',
    categoryLabel: 'Lune Océanique de Jupiter',
    tagline: 'Un immense océan d’eau liquide salée sous une coquille de glace',
    diameterKm: 3122,
    gravityMps2: 1.315,
    gravityVsEarth: 0.134,
    avgTempCelsius: -170,
    tempRangeText: '-160°C (équateur) à -220°C (pôles)',
    hasAtmosphere: false,
    atmosphereSummary: 'Atmosphère ténue d’oxygène moléculaire d’origine radiolytique',
    atmosphereComposition: [
      { gas: 'Oxygène (O₂)', percentage: '~100%' }
    ],
    knownMaterials: ['Croûte de glace d’eau pure', 'Sels de magnésium et sulfate', 'Océan subglaciaire profond', 'Noyau rocheux'],
    distanceFromEarth: {
      minKm: '588 millions km',
      maxKm: '968 millions km',
      averageKm: '778 millions km',
      note: 'Orbite autour de Jupiter en 3,55 jours en résonance gravitationnelle avec Io et Ganymède'
    },
    dayLength: '3,55 jours terrestres (synchrone)',
    yearLength: '11,86 ans terrestres (avec Jupiter)',
    scientificAttribution: 'NASA / JPL-Caltech / Mission Galileo / USGS Astrogeology',
    scientificNotes: 'Son océan intérieur contiendrait deux fois plus d’eau liquide que tous les océans terrestres combinés.',
    texturePath: '/assets/planets/europa.jpg',
    colorHex: '#e2e8f0',
    glowColor: 'rgba(56, 189, 248, 0.4)',
    trajectoryColor: '#38bdf8',
    hubPosition: { xPercent: 0.566, yPercent: 0.352, baseRadius: 0.58 },
    isHubHero: true,
    region: 'Système solaire'
  },
  {
    id: 'titan',
    name: 'Titan',
    nameEn: 'Titan',
    category: 'moon',
    categoryLabel: 'Lune à Atmosphère Dense de Saturne',
    tagline: 'Le seul monde extraterrestre doté de mers et pluies d’hydrocarbures',
    diameterKm: 5149,
    gravityMps2: 1.352,
    gravityVsEarth: 0.138,
    avgTempCelsius: -179,
    tempRangeText: '-179°C stable à la surface',
    hasAtmosphere: true,
    atmosphereSummary: 'Atmosphère dense et opaque d’azote et méthane (pression au sol : 1,45 bar)',
    atmosphereComposition: [
      { gas: 'Azote (N₂)', percentage: 95 },
      { gas: 'Méthane (CH₄)', percentage: 4.9 },
      { gas: 'Hydrocarbures complexes (tholins)', percentage: 0.1 }
    ],
    knownMaterials: ['Méthane et éthane liquides', 'Glace d’eau formant le socle rocheux', 'Tholins organiques atmosphériques'],
    distanceFromEarth: {
      minKm: '1,2 milliard km',
      maxKm: '1,6 milliard km',
      averageKm: '1,4 milliard km',
      note: 'Seule lune du système solaire possédant une atmosphère dense supérieure à celle de la Terre'
    },
    dayLength: '15,9 jours terrestres (synchrone)',
    yearLength: '29,45 ans terrestres (avec Saturne)',
    scientificAttribution: 'NASA / ESA / ASI Mission Cassini-Huygens',
    scientificNotes: 'Cycle hydrologique complet basé sur le méthane liquide : nuages, pluies, rivières et mers.',
    texturePath: '/assets/planets/titan.jpg',
    colorHex: '#fbbf24',
    glowColor: 'rgba(251, 191, 36, 0.45)',
    trajectoryColor: '#f59e0b',
    hubPosition: { xPercent: 0.710, yPercent: 0.432, baseRadius: 0.60 },
    isHubHero: true,
    region: 'Système solaire'
  },
  {
    id: 'saturn',
    name: 'Saturne',
    nameEn: 'Saturn',
    category: 'gas_giant',
    categoryLabel: 'Géante Gazeuse Majeure',
    tagline: 'Le joyau du système solaire entouré d’anneaux majestueux',
    diameterKm: 116464,
    gravityMps2: 10.44,
    gravityVsEarth: 1.065,
    avgTempCelsius: -139,
    tempRangeText: '-185°C (nuages) à +11 700°C (centre)',
    hasAtmosphere: true,
    atmosphereSummary: 'Vaste enveloppe d’hydrogène et d’hélium aux vents supersoniques (jusqu’à 1 800 km/h)',
    atmosphereComposition: [
      { gas: 'Hydrogène (H₂)', percentage: 96.3 },
      { gas: 'Hélium (He)', percentage: 3.25 },
      { gas: 'Méthane (CH₄)', percentage: 0.45 }
    ],
    knownMaterials: ['Hydrogène métallique au cœur', 'Ammoniac et phosphine', 'Anneaux de glace d’eau pure (99%)'],
    distanceFromEarth: {
      minKm: '1,2 milliard km',
      maxKm: '1,65 milliard km',
      averageKm: '1,43 milliard km',
      note: 'Distance Terre-Saturne variant selon leurs positions orbitales respectives'
    },
    dayLength: '10 h 33 min',
    yearLength: '29,45 ans terrestres',
    scientificAttribution: 'NASA / JPL Cassini-Huygens / Solar System Scope',
    scientificNotes: 'Les anneaux s’étendent sur 282 000 km avec une épaisseur moyenne de seulement 10 mètres à 1 km.',
    texturePath: '/assets/planets/saturn.jpg',
    ringTexturePath: '/assets/planets/saturn-ring-alpha.png',
    colorHex: '#fef08a',
    glowColor: 'rgba(254, 240, 138, 0.35)',
    trajectoryColor: '#38bdf8',
    hubPosition: { xPercent: 0.945, yPercent: 0.400, baseRadius: 1.48 },
    hasRings: true,
    ringsRadius: { inner: 1.26, outer: 2.25 },
    isHubHero: true,
    region: 'Système solaire'
  }
];

export const OTHER_DESTINATIONS: Destination[] = [
  {
    id: 'sun',
    name: 'Soleil',
    nameEn: 'Sun',
    category: 'star',
    categoryLabel: 'Étoile Naine Jaune (G2V)',
    tagline: 'Le cœur gravitationnel et la source d’énergie de notre système planétaire',
    diameterKm: 1392700,
    gravityMps2: 274.0,
    gravityVsEarth: 27.9,
    avgTempCelsius: 5500,
    tempRangeText: '5 500°C (surface) à 15 000 000°C (cœur)',
    hasAtmosphere: true,
    atmosphereSummary: 'Couronne solaire super-chaude et vent de plasma continu',
    atmosphereComposition: [
      { gas: 'Hydrogène', percentage: 73.46 },
      { gas: 'Hélium', percentage: 24.85 },
      { gas: 'Oxygène, Carbone, Fer', percentage: 1.69 }
    ],
    knownMaterials: ['Plasma d’hydrogène et d’hélium ionisés', 'Champ magnétique solaire'],
    distanceFromEarth: {
      minKm: '147,1 millions km (périhélie)',
      maxKm: '152,1 millions km (aphélie)',
      averageKm: '149,6 millions km (1 UA)',
      note: 'Définit 1 Unité Astronomique (UA). La lumière solaire met 8 min 20 s à parvenir sur Terre'
    },
    dayLength: '25 jours (équateur) à 35 jours (pôles)',
    yearLength: '230 millions d’années (orbite galactique)',
    scientificAttribution: 'NASA Solar Dynamics Observatory (SDO) / ESA SOHO',
    scientificNotes: 'Représente 99,86% de toute la masse du système solaire.',
    texturePath: '/assets/planets/sun.jpg',
    colorHex: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.7)',
    trajectoryColor: '#f59e0b',
    hubPosition: { xPercent: 0.05, yPercent: 0.5, baseRadius: 2.0 },
    isHubHero: false,
    region: 'Système solaire'
  },
  {
    id: 'mercury',
    name: 'Mercure',
    nameEn: 'Mercury',
    category: 'terrestrial',
    categoryLabel: 'Planète Tellurique Intérieure',
    tagline: 'Le monde métallique le plus proche et le plus rapide autour du Soleil',
    diameterKm: 4879,
    gravityMps2: 3.7,
    gravityVsEarth: 0.377,
    avgTempCelsius: 167,
    tempRangeText: '-180°C (nuit) à +430°C (jour)',
    hasAtmosphere: false,
    atmosphereSummary: 'Exosphère ultra-ténue continuellement renouvelée par le vent solaire',
    atmosphereComposition: [
      { gas: 'Oxygène', percentage: 42 },
      { gas: 'Sodium', percentage: 29 },
      { gas: 'Hydrogène', percentage: 22 }
    ],
    knownMaterials: ['Noyau métallique de fer-nickel (85% du rayon)', 'Manteau silicaté mince', 'Glace d’eau au fond des cratères polaires'],
    distanceFromEarth: {
      minKm: '77,3 millions km',
      maxKm: '222 millions km',
      averageKm: '150 millions km',
      note: 'Vitesse orbitale moyenne record de 47,4 km/s'
    },
    dayLength: '58,6 jours terrestres (jour sidéral)',
    yearLength: '88 jours terrestres',
    scientificAttribution: 'NASA MESSENGER / ESA-JAXA BepiColombo',
    scientificNotes: 'Possède un énorme cœur de fer liquide occupant l’essentiel de son volume interne.',
    texturePath: '/assets/planets/mercury.jpg',
    colorHex: '#9ca3af',
    glowColor: 'rgba(156, 163, 175, 0.35)',
    trajectoryColor: '#9ca3af',
    hubPosition: { xPercent: 0.15, yPercent: 0.4, baseRadius: 0.45 },
    isHubHero: false,
    region: 'Système solaire'
  },
  {
    id: 'venus',
    name: 'Vénus',
    nameEn: 'Venus',
    category: 'terrestrial',
    categoryLabel: 'Planète Tellurique à Effet de Serre Extrême',
    tagline: 'La jumelle infernale de la Terre enveloppée de nuages d’acide',
    diameterKm: 12104,
    gravityMps2: 8.87,
    gravityVsEarth: 0.905,
    avgTempCelsius: 464,
    tempRangeText: '464°C constante jour et nuit (effet de serre maximal)',
    hasAtmosphere: true,
    atmosphereSummary: 'Atmosphère supercritique de CO₂ sous une pression titanesque de 93 bars',
    atmosphereComposition: [
      { gas: 'Dioxyde de carbone (CO₂)', percentage: 96.5 },
      { gas: 'Azote (N₂)', percentage: 3.5 },
      { gas: 'Dioxyde de soufre (SO₂)', percentage: 0.015 }
    ],
    knownMaterials: ['Basaltes volcaniques', 'Laves visqueuses', 'Nuages d’acide sulfurique concentré'],
    distanceFromEarth: {
      minKm: '38 millions km',
      maxKm: '261 millions km',
      averageKm: '162 millions km',
      note: 'Planète la plus proche de la Terre lors de sa conjonction inférieure'
    },
    dayLength: '243 jours terrestres (rotation rétrograde d’est en ouest)',
    yearLength: '224,7 jours terrestres',
    scientificAttribution: 'NASA Magellan / ESA Venus Express / JAXA Akatsuki',
    scientificNotes: 'La planète la plus brûlante de tout le système solaire, plus chaude encore que Mercure.',
    texturePath: '/assets/planets/venus-atmosphere.jpg',
    colorHex: '#fed7aa',
    glowColor: 'rgba(254, 215, 170, 0.45)',
    trajectoryColor: '#fed7aa',
    hubPosition: { xPercent: 0.22, yPercent: 0.45, baseRadius: 0.75 },
    isHubHero: false,
    region: 'Système solaire'
  },
  {
    id: 'earth',
    name: 'Terre',
    nameEn: 'Earth',
    category: 'terrestrial',
    categoryLabel: 'Planète Tellurique Océanique',
    tagline: 'L’oasis bleue abritant la seule vie connue dans l’Univers',
    diameterKm: 12742,
    gravityMps2: 9.807,
    gravityVsEarth: 1.0,
    avgTempCelsius: 15,
    tempRangeText: '-89°C (Antarctique) à +56,7°C (Vallée de la Mort)',
    hasAtmosphere: true,
    atmosphereSummary: 'Atmosphère protectrice riche en azote et oxygène avec couche d’ozone',
    atmosphereComposition: [
      { gas: 'Azote (N₂)', percentage: 78.08 },
      { gas: 'Oxygène (O₂)', percentage: 20.95 },
      { gas: 'Argon (Ar)', percentage: 0.93 },
      { gas: 'Vapeur d’eau et CO₂', percentage: 0.04 }
    ],
    knownMaterials: ['Eau liquide océanique (71% de la surface)', 'Croûte continentale granitique', 'Croûte océanique basaltique', 'Biosphère active'],
    distanceFromEarth: {
      minKm: '0 km',
      maxKm: '0 km',
      averageKm: '0 km (Origine de l’observateur)',
      note: 'Station orbitale située en orbite basse (altitude ~400 km)'
    },
    dayLength: '23 h 56 min 04 s',
    yearLength: '365,25 jours',
    scientificAttribution: 'NASA Blue Marble / NOAA / Solar System Scope',
    scientificNotes: 'Seule planète connue abritant de l’eau liquide de surface stable et la vie.',
    texturePath: '/assets/planets/earth.jpg',
    colorHex: '#60a5fa',
    glowColor: 'rgba(96, 165, 250, 0.5)',
    trajectoryColor: '#38bdf8',
    hubPosition: { xPercent: 0.5, yPercent: 0.85, baseRadius: 1.8 },
    isHubHero: false,
    region: 'Système solaire'
  },
  {
    id: 'phobos',
    name: 'Phobos',
    nameEn: 'Phobos',
    category: 'moon',
    categoryLabel: 'Lune Martienne Intérieure',
    tagline: 'Le satellite irrégulier condamné à s’écraser ou former un anneau autour de Mars',
    diameterKm: 22.2,
    gravityMps2: 0.0057,
    gravityVsEarth: 0.00058,
    avgTempCelsius: -40,
    tempRangeText: '-112°C (nuit) à -4°C (jour)',
    hasAtmosphere: false,
    atmosphereSummary: 'Aucune atmosphère',
    atmosphereComposition: [{ gas: 'Aucun gaz détectable', percentage: '0%' }],
    knownMaterials: ['Matériaux carbonés chondritiques de type C', 'Poussière et régolithe bréchique', 'Cratère d’impact géant Stickney'],
    distanceFromEarth: {
      minKm: '54,6 millions km',
      maxKm: '401 millions km',
      averageKm: '225 millions km',
      note: 'Orbite à seulement 6 000 km de la surface martienne (plus proche lune de sa planète)'
    },
    dayLength: '7 h 39 min (tourne 3 fois plus vite que Mars sur elle-même)',
    yearLength: '687 jours (avec Mars)',
    scientificAttribution: 'NASA Mars Reconnaissance Orbiter (HiRISE) / ESA Mars Express',
    scientificNotes: 'Se rapproche de Mars de 1,8 mètre par siècle et sera détruite par les forces de marée d’ici 30 à 50 millions d’années.',
    texturePath: '/assets/planets/phobos.jpg',
    colorHex: '#78716c',
    glowColor: 'rgba(120, 113, 108, 0.3)',
    trajectoryColor: '#a8a29e',
    hubPosition: { xPercent: 0.43, yPercent: 0.22, baseRadius: 0.3 },
    isHubHero: false,
    region: 'Système solaire'
  },
  {
    id: 'deimos',
    name: 'Déimos',
    nameEn: 'Deimos',
    category: 'moon',
    categoryLabel: 'Lune Martienne Extérieure',
    tagline: 'Un petit fragment rocheux lointain drapé d’un épais manteau de poussière',
    diameterKm: 12.4,
    gravityMps2: 0.003,
    gravityVsEarth: 0.0003,
    avgTempCelsius: -40,
    tempRangeText: '-110°C (nuit) à -4°C (jour)',
    hasAtmosphere: false,
    atmosphereSummary: 'Aucune atmosphère',
    atmosphereComposition: [{ gas: 'Aucun gaz', percentage: '0%' }],
    knownMaterials: ['Roches riches en carbone (chondrite carbonée)', 'Épaisse couverture de régolithe régulier'],
    distanceFromEarth: {
      minKm: '54,6 millions km',
      maxKm: '401 millions km',
      averageKm: '225 millions km',
      note: 'Orbite à 23 460 km de Mars en 30,3 heures'
    },
    dayLength: '30,3 heures (rotation synchrone)',
    yearLength: '687 jours (avec Mars)',
    scientificAttribution: 'NASA Mars Reconnaissance Orbiter / Viking 1',
    scientificNotes: 'Sa vitesse de libération est de seulement 20 km/h : une impulsion humaine suffirait à s’en échapper.',
    texturePath: '/assets/planets/deimos.jpg',
    colorHex: '#a8a29e',
    glowColor: 'rgba(168, 162, 158, 0.3)',
    trajectoryColor: '#a8a29e',
    hubPosition: { xPercent: 0.45, yPercent: 0.21, baseRadius: 0.25 },
    isHubHero: false,
    region: 'Système solaire'
  },
  {
    id: 'ceres',
    name: 'Cérès',
    nameEn: 'Ceres',
    category: 'dwarf',
    categoryLabel: 'Planète Naine de la Ceinture Principale',
    tagline: 'Le plus grand objet entre Mars et Jupiter, riche en eau et minéraux hydratés',
    diameterKm: 939,
    gravityMps2: 0.28,
    gravityVsEarth: 0.029,
    avgTempCelsius: -106,
    tempRangeText: '-143°C à -38°C',
    hasAtmosphere: false,
    atmosphereSummary: 'Exosphère transitoire de vapeur d’eau par sublimation',
    atmosphereComposition: [{ gas: 'Vapeur d’eau (H₂O)', percentage: 'Traces' }],
    knownMaterials: ['Carbonates de sodium (taches blanches d’Occator)', 'Argiles ammoniées', 'Manteau de glace d’eau', 'Noyau rocheux'],
    distanceFromEarth: {
      minKm: '239 millions km',
      maxKm: '593 millions km',
      averageKm: '413 millions km',
      note: 'Située au cœur de la ceinture d’astéroïdes à 2,77 UA du Soleil'
    },
    dayLength: '9 h 4 min',
    yearLength: '4,6 ans terrestres',
    scientificAttribution: 'NASA Mission Dawn / JPL-Caltech',
    scientificNotes: 'Contient potentiellement plus d’eau douce totale que la Terre sous forme de glace et saumures.',
    texturePath: '/assets/planets/ceres.jpg',
    colorHex: '#94a3b8',
    glowColor: 'rgba(148, 163, 184, 0.3)',
    trajectoryColor: '#94a3b8',
    hubPosition: { xPercent: 0.52, yPercent: 0.32, baseRadius: 0.38 },
    isHubHero: false,
    region: 'Système solaire'
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    nameEn: 'Jupiter',
    category: 'gas_giant',
    categoryLabel: 'Géante Gazeuse Majeure',
    tagline: 'Le colosse régnant sur le système solaire avec sa Grande Tache Rouge',
    diameterKm: 139820,
    gravityMps2: 24.79,
    gravityVsEarth: 2.528,
    avgTempCelsius: -110,
    tempRangeText: '-145°C (sommet nuageux) à +24 000°C (cœur)',
    hasAtmosphere: true,
    atmosphereSummary: 'Immense atmosphère zébrée de ceintures nuageuses et de tempêtes centenaires',
    atmosphereComposition: [
      { gas: 'Hydrogène (H₂)', percentage: 89.8 },
      { gas: 'Hélium (He)', percentage: 10.2 },
      { gas: 'Méthane et Ammoniac', percentage: 0.1 }
    ],
    knownMaterials: ['Hydrogène liquide et métallique conducteur', 'Nuages de glace d’ammoniac et d’hydrosulfure', 'Noyau dense dilué'],
    distanceFromEarth: {
      minKm: '588 millions km',
      maxKm: '968 millions km',
      averageKm: '778 millions km',
      note: 'Planète la plus massive : 2,5 fois la masse de toutes les autres planètes réunies'
    },
    dayLength: '9 h 55 min (rotation record de toutes les planètes)',
    yearLength: '11,86 ans terrestres',
    scientificAttribution: 'NASA Juno / Voyager 1 & 2 / Hubble Space Telescope',
    scientificNotes: 'Génère le champ magnétique le plus puissant du système solaire après le Soleil.',
    texturePath: '/assets/planets/jupiter.jpg',
    colorHex: '#d97706',
    glowColor: 'rgba(217, 119, 6, 0.45)',
    trajectoryColor: '#d97706',
    hubPosition: { xPercent: 0.62, yPercent: 0.36, baseRadius: 1.6 },
    isHubHero: false,
    region: 'Système solaire'
  },
  {
    id: 'io',
    name: 'Io',
    nameEn: 'Io',
    category: 'moon',
    categoryLabel: 'Lune Volcanique Jovienne',
    tagline: 'Le monde volcanique le plus actif de tout le système solaire',
    diameterKm: 3643,
    gravityMps2: 1.796,
    gravityVsEarth: 0.183,
    avgTempCelsius: -130,
    tempRangeText: '-143°C (moyenne) à +1 600°C (laves de calderas)',
    hasAtmosphere: true,
    atmosphereSummary: 'Atmosphère ténue de dioxyde de soufre alimentée par plus de 400 volcans actifs',
    atmosphereComposition: [
      { gas: 'Dioxyde de soufre (SO₂)', percentage: 90 },
      { gas: 'Monoxyde de soufre (SO), Sodium, Chlore', percentage: 10 }
    ],
    knownMaterials: ['Soufre élémentaire et dioxyde de soufre gelé', 'Laves ultramafiques riches en magnésium', 'Silicates'],
    distanceFromEarth: {
      minKm: '588 millions km',
      maxKm: '968 millions km',
      averageKm: '778 millions km',
      note: 'Effets de marée colossaux provoqués par Jupiter et les autres lunes galiléennes'
    },
    dayLength: '42,5 heures (synchrone)',
    yearLength: '11,86 ans (avec Jupiter)',
    scientificAttribution: 'NASA Juno / Galileo / New Horizons',
    scientificNotes: 'Les panaches volcaniques d’Io projettent des laves et gaz soufrés jusqu’à 500 km d’altitude.',
    texturePath: '/assets/planets/io.jpg',
    colorHex: '#eab308',
    glowColor: 'rgba(234, 179, 8, 0.4)',
    trajectoryColor: '#eab308',
    hubPosition: { xPercent: 0.55, yPercent: 0.38, baseRadius: 0.52 },
    isHubHero: false,
    region: 'Système solaire'
  },
  {
    id: 'ganymede',
    name: 'Ganymède',
    nameEn: 'Ganymede',
    category: 'ocean_world',
    categoryLabel: 'Plus Grande Lune du Système Solaire',
    tagline: 'Un géant glacé plus grand que Mercure doté de son propre champ magnétique',
    diameterKm: 5268,
    gravityMps2: 1.428,
    gravityVsEarth: 0.146,
    avgTempCelsius: -163,
    tempRangeText: '-203°C à -121°C',
    hasAtmosphere: false,
    atmosphereSummary: 'Atmosphère ténue d’oxygène moléculaire d’origine radiolytique',
    atmosphereComposition: [{ gas: 'Oxygène (O₂, O)', percentage: '~100%' }],
    knownMaterials: ['Glace d’eau sous plusieurs phases cristallines', 'Océan liquide pris en sandwich', 'Noyau de fer liquide'],
    distanceFromEarth: {
      minKm: '588 millions km',
      maxKm: '968 millions km',
      averageKm: '778 millions km',
      note: 'Seule lune du système solaire connue possédant une magnétosphère propre'
    },
    dayLength: '7,15 jours terrestres (synchrone)',
    yearLength: '11,86 ans (avec Jupiter)',
    scientificAttribution: 'NASA Galileo / Juno / ESA JUICE Target',
    scientificNotes: 'Possède un diamètre supérieur à celui de la planète Mercure (5 268 km contre 4 879 km).',
    texturePath: '/assets/planets/ganymede.jpg',
    colorHex: '#94a3b8',
    glowColor: 'rgba(148, 163, 184, 0.35)',
    trajectoryColor: '#94a3b8',
    hubPosition: { xPercent: 0.65, yPercent: 0.35, baseRadius: 0.68 },
    isHubHero: false,
    region: 'Système solaire'
  },
  {
    id: 'callisto',
    name: 'Callisto',
    nameEn: 'Callisto',
    category: 'moon',
    categoryLabel: 'Lune Glacée Fortement Cratérisée',
    tagline: 'La surface la plus ancienne et la plus cratérisée du système solaire',
    diameterKm: 4821,
    gravityMps2: 1.235,
    gravityVsEarth: 0.126,
    avgTempCelsius: -139,
    tempRangeText: '-193°C à -108°C',
    hasAtmosphere: false,
    atmosphereSummary: 'Exosphère de dioxyde de carbone et oxygène',
    atmosphereComposition: [{ gas: 'CO₂', percentage: '~100%' }],
    knownMaterials: ['Glace d’eau sale', 'Silicates et roches carbonées', 'Bassin d’impact concentrique géant Valhalla'],
    distanceFromEarth: {
      minKm: '588 millions km',
      maxKm: '968 millions km',
      averageKm: '778 millions km',
      note: 'Lune galiléenne la plus éloignée de Jupiter, épargnée par les ceintures de radiations extrêmes'
    },
    dayLength: '16,7 jours terrestres (synchrone)',
    yearLength: '11,86 ans (avec Jupiter)',
    scientificAttribution: 'NASA Galileo / Voyager / USGS Astrogeology',
    scientificNotes: 'Sa surface n’a pas été remaniée par la tectonique depuis plus de 4 milliards d’années.',
    texturePath: '/assets/planets/callisto.jpg',
    colorHex: '#64748b',
    glowColor: 'rgba(100, 116, 139, 0.3)',
    trajectoryColor: '#64748b',
    hubPosition: { xPercent: 0.68, yPercent: 0.38, baseRadius: 0.64 },
    isHubHero: false,
    region: 'Système solaire'
  },
  {
    id: 'enceladus',
    name: 'Encelade',
    nameEn: 'Enceladus',
    category: 'ocean_world',
    categoryLabel: 'Lune Océanique Cryovolcanique de Saturne',
    tagline: 'Le monde blanc étincelant propulsant des geysers d’eau dans l’espace',
    diameterKm: 504,
    gravityMps2: 0.113,
    gravityVsEarth: 0.0115,
    avgTempCelsius: -198,
    tempRangeText: '-209°C à -130°C (fractures actives)',
    hasAtmosphere: false,
    atmosphereSummary: 'Panaches cryovolcaniques temporaires formant l’anneau E de Saturne',
    atmosphereComposition: [
      { gas: 'Vapeur d’eau (H₂O)', percentage: 91 },
      { gas: 'Azote (N₂)', percentage: 4 },
      { gas: 'Dioxyde de carbone (CO₂)', percentage: 3.2 },
      { gas: 'Méthane (CH₄)', percentage: 1.7 }
    ],
    knownMaterials: ['Glace d’eau ultra-réfléchissante (albédo de 99%)', 'Sels et silicates hydrothermaux', 'Molécules organiques complexes'],
    distanceFromEarth: {
      minKm: '1,2 milliard km',
      maxKm: '1,65 milliard km',
      averageKm: '1,43 milliard km',
      note: 'Les geysers du pôle sud jaillissent de crevasses tectoniques nommées « rayures de tigre »'
    },
    dayLength: '32,9 heures (synchrone)',
    yearLength: '29,45 ans (avec Saturne)',
    scientificAttribution: 'NASA / ESA Cassini-Huygens Mission',
    scientificNotes: 'Abrite une activité hydrothermale au fond de son océan subglaciaire, analogue aux fumeurs noirs terrestres.',
    texturePath: '/assets/planets/enceladus.jpg',
    colorHex: '#f8fafc',
    glowColor: 'rgba(248, 250, 252, 0.5)',
    trajectoryColor: '#38bdf8',
    hubPosition: { xPercent: 0.73, yPercent: 0.44, baseRadius: 0.34 },
    isHubHero: false,
    region: 'Système solaire'
  },
  {
    id: 'uranus',
    name: 'Uranus',
    nameEn: 'Uranus',
    category: 'ice_giant',
    categoryLabel: 'Géante de Glace Inclinée',
    tagline: 'Le géant aigue-marine couché sur son plan orbital',
    diameterKm: 50724,
    gravityMps2: 8.69,
    gravityVsEarth: 0.886,
    avgTempCelsius: -195,
    tempRangeText: '-224°C (record de froid atmosphérique)',
    hasAtmosphere: true,
    atmosphereSummary: 'Atmosphère d’hydrogène et d’hélium teintée de bleu par le méthane',
    atmosphereComposition: [
      { gas: 'Hydrogène (H₂)', percentage: 83 },
      { gas: 'Hélium (He)', percentage: 15 },
      { gas: 'Méthane (CH₄)', percentage: 2.3 }
    ],
    knownMaterials: ['Manteau de glaces fluides (eau, ammoniac, méthane)', 'Noyau rocheux de silicates', 'Anneaux de poussière sombre'],
    distanceFromEarth: {
      minKm: '2,6 milliards km',
      maxKm: '3,15 milliards km',
      averageKm: '2,87 milliards km',
      note: 'Axe de rotation incliné à 97,77° par rapport à son plan orbital'
    },
    dayLength: '17 h 14 min (rotation rétrograde)',
    yearLength: '84 ans terrestres',
    scientificAttribution: 'NASA Voyager 2 / Hubble Space Telescope',
    scientificNotes: 'Roule littéralement sur son orbite, exposant alternativement chaque pôle au Soleil pendant 42 ans.',
    texturePath: '/assets/planets/uranus.jpg',
    colorHex: '#67e8f9',
    glowColor: 'rgba(103, 232, 249, 0.4)',
    trajectoryColor: '#67e8f9',
    hubPosition: { xPercent: 0.85, yPercent: 0.32, baseRadius: 0.9 },
    isHubHero: false,
    region: 'Système solaire'
  },
  {
    id: 'neptune',
    name: 'Neptune',
    nameEn: 'Neptune',
    category: 'ice_giant',
    categoryLabel: 'Géante de Glace Lointaine',
    tagline: 'Le monde d’azur aux tempêtes supersoniques les plus violentes',
    diameterKm: 49244,
    gravityMps2: 11.15,
    gravityVsEarth: 1.137,
    avgTempCelsius: -201,
    tempRangeText: '-218°C (sommet nuageux) à +7 000°C (cœur)',
    hasAtmosphere: true,
    atmosphereSummary: 'Atmosphère dynamique d’hydrogène et d’hélium balayée par des vents à 2 100 km/h',
    atmosphereComposition: [
      { gas: 'Hydrogène (H₂)', percentage: 80 },
      { gas: 'Hélium (He)', percentage: 19 },
      { gas: 'Méthane (CH₄)', percentage: 1.5 }
    ],
    knownMaterials: ['Glaces supercritiques d’eau, ammoniac et méthane', 'Nuages de cristaux de méthane', 'Noyau rocheux lourd'],
    distanceFromEarth: {
      minKm: '4,3 milliards km',
      maxKm: '4,7 milliards km',
      averageKm: '4,5 milliards km',
      note: 'Dernière planète majeure reconnue du système solaire (30 UA du Soleil)'
    },
    dayLength: '16 h 6 min',
    yearLength: '164,8 ans terrestres',
    scientificAttribution: 'NASA Voyager 2 / Hubble Space Telescope / James Webb Space Telescope',
    scientificNotes: 'Première planète découverte par prédiction mathématique (Urbain Le Verrier, 1846) avant observation visuelle.',
    texturePath: '/assets/planets/neptune.jpg',
    colorHex: '#3b82f6',
    glowColor: 'rgba(59, 130, 246, 0.45)',
    trajectoryColor: '#3b82f6',
    hubPosition: { xPercent: 0.90, yPercent: 0.28, baseRadius: 0.88 },
    isHubHero: false,
    region: 'Système solaire'
  },
  {
    id: 'triton',
    name: 'Triton',
    nameEn: 'Triton',
    category: 'moon',
    categoryLabel: 'Lune Glacée Rétrograde de Neptune',
    tagline: 'Un monde d’azote gelé capturé dans la ceinture de Kuiper aux geysers actifs',
    diameterKm: 2707,
    gravityMps2: 0.779,
    gravityVsEarth: 0.079,
    avgTempCelsius: -235,
    tempRangeText: '-235°C (l’un des corps les plus froids observés)',
    hasAtmosphere: true,
    atmosphereSummary: 'Atmosphère ultra-ténue d’azote avec brumes photochimiques (pression 1,4 Pa)',
    atmosphereComposition: [
      { gas: 'Azote (N₂)', percentage: 99 },
      { gas: 'Monoxyde de carbone (CO) et Méthane (CH₄)', percentage: 1 }
    ],
    knownMaterials: ['Glaces d’azote, de méthane et de monoxyde de carbone', 'Terrain dit en peau de melon (cantaloupe)', 'Geysers d’azote gazeux et poussières sombres'],
    distanceFromEarth: {
      minKm: '4,3 milliards km',
      maxKm: '4,7 milliards km',
      averageKm: '4,5 milliards km',
      note: 'Seule grande lune du système solaire à orbiter en sens rétrograde (sens inverse de rotation de Neptune)'
    },
    dayLength: '5,88 jours terrestres (synchrone rétrograde)',
    yearLength: '164,8 ans (avec Neptune)',
    scientificAttribution: 'NASA Voyager 2 (Survol de 1989)',
    scientificNotes: 'Probable objet transneptunien capturé par Neptune ; ses geysers crachent de l’azote liquide réchauffé par le Soleil.',
    texturePath: '/assets/planets/triton.jpg',
    colorHex: '#f472b6',
    glowColor: 'rgba(244, 114, 182, 0.35)',
    trajectoryColor: '#f472b6',
    hubPosition: { xPercent: 0.92, yPercent: 0.25, baseRadius: 0.48 },
    isHubHero: false,
    region: 'Système solaire'
  },
  {
    id: 'pluto',
    name: 'Pluton',
    nameEn: 'Pluto',
    category: 'dwarf',
    categoryLabel: 'Planète Naine de la Ceinture de Kuiper',
    tagline: 'Le cœur glacé de l’espace lointain parsemé de montagnes d’eau et de glaciers d’azote',
    diameterKm: 2376,
    gravityMps2: 0.62,
    gravityVsEarth: 0.063,
    avgTempCelsius: -230,
    tempRangeText: '-233°C à -223°C',
    hasAtmosphere: true,
    atmosphereSummary: 'Atmosphère saisonnière ténue d’azote se condensant quand Pluton s’éloigne du Soleil',
    atmosphereComposition: [
      { gas: 'Azote (N₂)', percentage: 99 },
      { gas: 'Méthane (CH₄)', percentage: 0.5 },
      { gas: 'Monoxyde de carbone (CO)', percentage: 0.5 }
    ],
    knownMaterials: ['Glacier d’azote de Tombaugh Regio (le Cœur)', 'Montagnes de glace d’eau dure comme du roc', 'Dépôts de tholins rougeoyants'],
    distanceFromEarth: {
      minKm: '4,28 milliards km (périhélie)',
      maxKm: '7,53 milliards km (aphélie)',
      averageKm: '5,9 milliards km (39,5 UA)',
      note: 'Orbite très excentrique et inclinée à 17° ; parfois plus proche du Soleil que Neptune'
    },
    dayLength: '6,39 jours terrestres (synchrone avec Charon)',
    yearLength: '248 ans terrestres',
    scientificAttribution: 'NASA New Horizons Mission (Survol historique de juillet 2015)',
    scientificNotes: 'Forme avec sa lune Charon un véritable système planétaire double où le centre de gravité est situé hors des corps.',
    texturePath: '/assets/planets/pluto.jpg',
    colorHex: '#e2e8f0',
    glowColor: 'rgba(226, 232, 240, 0.35)',
    trajectoryColor: '#e2e8f0',
    hubPosition: { xPercent: 0.95, yPercent: 0.22, baseRadius: 0.44 },
    isHubHero: false,
    region: 'Système solaire'
  },
  {
    id: 'charon',
    name: 'Charon',
    nameEn: 'Charon',
    category: 'moon',
    categoryLabel: 'Compagnon Binaire de Pluton',
    tagline: 'Le géant compagnon au pôle rouge Mordor Macula et aux canyons vertigineux',
    diameterKm: 1212,
    gravityMps2: 0.288,
    gravityVsEarth: 0.029,
    avgTempCelsius: -228,
    tempRangeText: '-235°C à -220°C',
    hasAtmosphere: false,
    atmosphereSummary: 'Aucune atmosphère significative',
    atmosphereComposition: [{ gas: 'Aucun gaz détectable', percentage: '0%' }],
    knownMaterials: ['Glace d’eau cristalline', 'Hydrates d’ammoniac', 'Tholins rougeâtres au pôle nord (Mordor Macula) capturés depuis Pluton', 'Canyon d’Argo Chasma (9 km de profondeur)'],
    distanceFromEarth: {
      minKm: '4,28 milliards km',
      maxKm: '7,53 milliards km',
      averageKm: '5,9 milliards km',
      note: 'Orbite à seulement 19 570 km de Pluton ; verrouillage gravitationnel mutuel absolu'
    },
    dayLength: '6,39 jours terrestres (montre toujours la même face à Pluton)',
    yearLength: '248 ans (avec Pluton)',
    scientificAttribution: 'NASA New Horizons Mission',
    scientificNotes: 'Fait la moitié de la taille de Pluton, formant le rapport lune/planète le plus grand du système solaire.',
    texturePath: '/assets/planets/charon.jpg',
    colorHex: '#94a3b8',
    glowColor: 'rgba(148, 163, 184, 0.3)',
    trajectoryColor: '#94a3b8',
    hubPosition: { xPercent: 0.97, yPercent: 0.24, baseRadius: 0.32 },
    isHubHero: false,
    region: 'Système solaire'
  }
];

export const ALL_DESTINATIONS: Destination[] = [
  ...MAIN_DESTINATIONS,
  ...OTHER_DESTINATIONS,
];
