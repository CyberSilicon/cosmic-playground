
import { ALL_DESTINATIONS, type Destination } from './destinations';

export type UniverseRegion = 'Système solaire' | 'Voie lactée';
export type UniverseCategory = 'solar-system' | 'milky-way';
export type TravelExperienceType = 'surface' | 'flyby' | 'orbit' | 'speculative-view' | 'depth-probe';
export type CelestialCategory = 'star' | 'terrestrial_planet' | 'gas_giant' | 'ice_giant' | 'dwarf_planet' | 'moon' | 'ocean_world' | 'asteroid' | 'stellar_system' | 'exoplanet';
export type ObservationTier = 'direct_imaging' | 'transit' | 'radial_velocity' | 'astrometry';

export interface ScienceTiers { observed:string[]; deduced:string[]; hypothetical:string[] }
export interface UniverseCatalogDestination {
  id:string; name:string; nameEn:string;
  category:CelestialCategory; region:UniverseRegion; experienceType:TravelExperienceType;
  phase:'start' | 'later' | 'distant' | 'very-distant';
  texturePath:string; colorHex:string; glowColor:string; trajectoryColor:string;
  mapPosition:{xPercent:number;yPercent:number;zCamera:number}; baseRadius:number;
  ringsRadius?:{inner:number;outer:number};
  tagline:string; groundExplorationConceptuallyPossible:boolean;
  distanceToEarth:{min:string;max:string;average:string;note:string};
  scientificDataStatus:'to_verify' | 'confirmed' | 'artist_conceptual' | 'inferred';
  surfaceStatus:'observed' | 'modelled' | 'artist_concept';
  scienceTiers?:ScienceTiers; detectionMethods?:ObservationTier[];
  scientificAttribution:string; scientificNotes?:string; knownMaterials?:string[];
}
export const CATEGORIES: {id:UniverseCategory;label:string;icon:string}[] = [
  {id:'solar-system',label:'Système solaire',icon:'☀'},
  {id:'milky-way',label:'Voie lactée',icon:'✦'},
];
function categoryOf(d:Destination):CelestialCategory {
  if (d.category==='terrestrial') return 'terrestrial_planet';
  if (d.category==='dwarf') return 'dwarf_planet';
  return d.category;
}
function toCatalog(d:Destination):UniverseCatalogDestination {
  const atmosphereOnly = d.category==='gas_giant' || d.category==='ice_giant' || d.category==='star';
  const isExoplanet = d.category==='exoplanet';
  return {
    id:d.id,name:d.name,nameEn:d.nameEn, category:categoryOf(d),region:d.region,
    experienceType:isExoplanet?'speculative-view':atmosphereOnly?'flyby':'surface',
    phase:isExoplanet?'very-distant':'start',
    texturePath:d.texturePath,colorHex:d.colorHex,glowColor:d.glowColor,trajectoryColor:d.trajectoryColor,
    mapPosition:{xPercent:d.hubPosition.xPercent,yPercent:d.hubPosition.yPercent,zCamera:0},
    baseRadius:d.hubPosition.baseRadius,ringsRadius:d.ringsRadius,
    tagline:d.tagline,groundExplorationConceptuallyPossible:!atmosphereOnly&&!isExoplanet,
    distanceToEarth:{min:d.distanceFromEarth.minKm,max:d.distanceFromEarth.maxKm,average:d.distanceFromEarth.averageKm,note:d.distanceFromEarth.note},
    scientificDataStatus:'to_verify',
    surfaceStatus:isExoplanet?'artist_concept':'modelled',
    scientificAttribution:d.scientificAttribution,scientificNotes:d.scientificNotes,knownMaterials:d.knownMaterials,
  };
}
export const UNIVERSE_CATALOG:UniverseCatalogDestination[] = ALL_DESTINATIONS.map(toCatalog);
export function getDestinationById(id:string):UniverseCatalogDestination | undefined {
  return UNIVERSE_CATALOG.find(d=>d.id===id);
}
export function getSmartObjects(region:UniverseRegion):UniverseCatalogDestination[] {
  return UNIVERSE_CATALOG.filter(d=>d.region===region);
}
