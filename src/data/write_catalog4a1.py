# Write chunk 4a1: alpha-centauri-system
import os

f = r'k:/Website/Next-project/cosmic-playground/src/data/universe-catalog.ts'
lines = []
lines.append("")
lines.append("  // ═══════════════════════════════════════════")
lines.append("  // CATÉGORIE 2 : AU-DELÀ DU SYSTÈME SOLAIRE")
lines.append("  // ═══════════════════════════════════════════")
lines.append("")
lines.append("  // ── Système stellaire : Alpha Centauri ──")
lines.append("  {")
lines.append("    id: 'alpha-centauri-system',")
lines.append("    name: 'Alpha Centauri (système)',")
lines.append("    nameEn: 'Alpha Centauri System',")
lines.append("    category: 'stellar_system',")
lines.append("    region: 'Voie lactée',")
lines.append("    experienceType: 'flyby',")
lines.append("    phase: 'very-distant',")
lines.append("    texturePath: '/assets/planets/sun.jpg',")
lines.append("    colorHex: '#fbbf24',")
lines.append("    glowColor: 'rgba(251, 191, 36, 0.4)',")
lines.append("    trajectoryColor: '#fbbf24',")
lines.append("    mapPosition: { xPercent: 0.06, yPercent: 0.8, zCamera: -2.5 },")
lines.append("    baseRadius: 2.2,")
lines.append("    tagline: 'Trois étoiles : α Cen A (G2V), α Cen B (K1V) et Proxima (M5.5Ve)',")
lines.append("    groundExplorationConceptuallyPossible: false,")
lines.append("    observationYear: 1689,")
lines.append("    scientificDataStatus: 'confirmed',")
lines.append("    surfaceStatus: 'observed',")
lines.append("    scientificAttribution: 'ESA Hipparcos / VLTI / Hubble',")
lines.append("    knownMaterials: ['α Cen A : G2V (étoile de type Sol)', 'α Cen B : K1V (orange)', 'Proxima : M5.5Ve (naine rouge)'],")
lines.append("    distanceToEarth: { min: '4,08 L année (périhélie)', max: '4,16 L année (aphélie)', average: '4,37 L année', note: '3 sails de distance (α Cen AB combiné)' },")
lines.append('  },')
lines.append('];')

s = '\n'.join(lines)
with open(f, 'a', encoding='utf-8') as fh:
    fh.write(s)

print('OK chunk 4a1: appended ' + str(len(s)) + ' chars')
