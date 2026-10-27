/**
 * Cosmic Playground — Galerie photographique des missions spatiales.
 *
 * Toutes les images ci-dessous sont des photographies réelles issues de missions
 * spatiales (NASA / JPL / ESA), dans le domaine public ou sous licence ouverte.
 * Aucun fichier n'est téléchargé ni embarqué : les URLs sont référencées telles
 * quelles. Pour la production, téléchargez et optimisez localement les images
 * utilisées, en conservant les crédits et licences d'origine.
 *
 * Références :
 *   - NASA Image and Video Library : https://images.nasa.gov
 *   - JPL Photojournal : https://photojournal.jpl.nasa.gov
 *   - ESA Science : https://sci.esa.int
 */

export interface SpacePhoto {
  id: string;
  title: string;
  image: string;
  source: string;
  credit: string;
  description: string;
  date?: string;
  type: 'surface' | 'orbit' | 'atmosphere' | 'cartographic';
}

const MARS_PHOTOS: SpacePhoto[] = [
  {
    id: 'mars-pia26755',
    title: 'Broom Point — Cratère Jezero',
    image: 'https://photojournal.jpl.nasa.gov/jpeg/PIA26755.jpg',
    source: 'https://photojournal.jpl.nasa.gov/catalog/PIA26755',
    credit: 'NASA/JPL-Caltech/ASU/MSSS',
    description: 'Panorama Mastcam-Z pris par le rover Perseverance à Broom Point, cratère Jezero. Photographie réelle de surface martienne.',
    date: '2025-05-15',
    type: 'surface',
  },
  {
    id: 'mars-pia26699',
    title: 'Crocodile Bridge — Cratère Jezero',
    image: 'https://photojournal.jpl.nasa.gov/jpeg/PIA26699.jpg',
    source: 'https://photojournal.jpl.nasa.gov/catalog/PIA26699',
    credit: 'NASA/JPL-Caltech/ASU/MSSS',
    description: 'Panorama composé de prises Mastcam-Z (décembre 2025 – janvier 2026) montrant la crête de Crocodile Bridge.',
    date: '2025-12',
    type: 'surface',
  },
  {
    id: 'mars-pia25309',
    title: 'Delta de la rivière — Cratère Jezero',
    image: 'https://photojournal.jpl.nasa.gov/jpeg/PIA25309.jpg',
    source: 'https://photojournal.jpl.nasa.gov/catalog/PIA25309',
    credit: 'NASA/JPL-Caltech/ASU/MSSS',
    description: 'Vue du delta fluviatile fossile de Jezero, ancien lac martien, photographié par Perseverance.',
    date: '2022-04',
    type: 'surface',
  },
];

const MOON_PHOTOS: SpacePhoto[] = [
  {
    id: 'moon-apollo11',
    title: "Pieds sur la Lune — Apollo 11",
    image: 'https://photojournal.jpl.nasa.gov/jpeg/PIA00372.jpg',
    source: 'https://photojournal.jpl.nasa.gov/catalog/PIA00372',
    credit: 'NASA',
    description: "Empreinte de botte lunaire dans le régolithe, mission Apollo 11 (1969).",
    date: '1969-07-20',
    type: 'surface',
  },
  {
    id: 'moon-lro',
    title: 'Cratère Copernic — Lunar Reconnaissance Orbiter',
    image: 'https://photojournal.jpl.nasa.gov/jpeg/PIA17983.jpg',
    source: 'https://photojournal.jpl.nasa.gov/catalog/PIA17983',
    credit: 'NASA/GSFC/Arizona State University',
    description: 'Vue orbitale du cratère Copernic capturée par la LRO.',
    date: '2013',
    type: 'orbit',
  },
];

const EUROPA_PHOTOS: SpacePhoto[] = [
  {
    id: 'europa-conam',
    title: 'Terrain Chaotique Conam Macula',
    image: 'https://photojournal.jpl.nasa.gov/jpeg/PIA01556.jpg',
    source: 'https://photojournal.jpl.nasa.gov/catalog/PIA01556',
    credit: 'NASA/JPL/University of Arizona',
    description: 'Régions de glace fracturée de la surface d’Europe (mission Galileo).',
    date: '1998',
    type: 'surface',
  },
];

const TITAN_PHOTOS: SpacePhoto[] = [
  {
    id: 'titan-huygens',
    title: 'Vue depuis Huygens — Surface de Titan',
    image: 'https://photojournal.jpl.nasa.gov/jpeg/PIA07231.jpg',
    source: 'https://photojournal.jpl.nasa.gov/catalog/PIA07231',
    credit: 'NASA/JPL/ESA/University of Arizona',
    description: 'Première photographie de la surface de Titan, prise par la sonde Huygens lors de sa descente (2005).',
    date: '2005-01-14',
    type: 'surface',
  },
];

const PLUTO_PHOTOS: SpacePhoto[] = [
  {
    id: 'pluto-heart',
    title: "Tombaugh Regio — Le Cœur de Pluton",
    image: 'https://photojournal.jpl.nasa.gov/jpeg/PIA19814.jpg',
    source: 'https://photojournal.jpl.nasa.gov/catalog/PIA19814',
    credit: 'NASA/JHUAPL/SwRI',
    description: 'Pluton en couleurs rapprochées, montrant le glacier d’azote du Cœur (Tombaugh Regio), survol New Horizons (2015).',
    date: '2015-07-14',
    type: 'surface',
  },
];

const ENCELADUS_PHOTOS: SpacePhoto[] = [
  {
    id: 'enceladus-plumes',
    title: 'Panaches de vapeur d’eau — Encelade',
    image: 'https://photojournal.jpl.nasa.gov/jpeg/PIA17192.jpg',
    source: 'https://photojournal.jpl.nasa.gov/catalog/PIA17192',
    credit: 'NASA/JPL/Space Science Institute',
    description: 'Panaches de glace et de vapeur s’élevant du pôle sud d’Encelade (mission Cassini).',
    date: '2015',
    type: 'atmosphere',
  },
];

const CARTOGRAPHIC_FALLBACK: Record<string, SpacePhoto> = {
  mars: {
    id: 'mars-map',
    title: 'Carte de référence — Mars',
    image: '/assets/planets/mars.jpg',
    source: 'https://edu.solarsystemscope.com/textures/',
    credit: 'Solar System Scope (CC BY 4.0) / NASA JPL',
    description: 'Carte cartographique de Mars. Vue de référence, non une photographie de surface.',
    type: 'cartographic',
  },
  moon: {
    id: 'moon-map',
    title: 'Carte de référence — Lune',
    image: '/assets/planets/moon.jpg',
    source: 'https://edu.solarsystemscope.com/textures/',
    credit: 'Solar System Scope (CC BY 4.0) / NASA LRO',
    description: 'Carte cartographique de la Lune. Vue de référence.',
    type: 'cartographic',
  },
  earth: {
    id: 'earth-map',
    title: 'Carte de référence — Terre',
    image: '/assets/planets/earth.jpg',
    source: 'https://edu.solarsystemscope.com/textures/',
    credit: 'Solar System Scope (CC BY 4.0)',
    description: 'Carte cartographique de la Terre.',
    type: 'cartographic',
  },
};

export const DESTINATION_PHOTOS: Record<string, SpacePhoto[]> = {
  mars: MARS_PHOTOS,
  moon: MOON_PHOTOS,
  europa: EUROPA_PHOTOS,
  titan: TITAN_PHOTOS,
  pluto: PLUTO_PHOTOS,
  enceladus: ENCELADUS_PHOTOS,
};

export function getPhotosForDestination(destinationId: string): SpacePhoto[] {
  const photos = DESTINATION_PHOTOS[destinationId];
  if (photos && photos.length > 0) return photos;
  const fallback = CARTOGRAPHIC_FALLBACK[destinationId];
  return fallback ? [fallback] : [];
}

export function getPrimaryPhoto(destinationId: string): SpacePhoto | null {
  const photos = getPhotosForDestination(destinationId);
  return photos.length > 0 ? photos[0] : null;
}
