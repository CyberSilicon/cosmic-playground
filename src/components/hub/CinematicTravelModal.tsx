'use client';

import React from 'react';
import { Destination } from '@/data/destinations';
import { PhotographicExplorer } from '@/components/travel/PhotographicExplorer';

interface CinematicTravelModalProps {
  destination: Destination | null;
  onClose: () => void;
  reducedMotion: boolean;
}

/**
 * CinematicTravelModal — Visionneur photographique plein écran.
 *
 * Remplace l'ancienne séquence de vol 3D + laboratoire + télémétrie.
 * Affiche les véritables photographies de missions spatiales pour la
 * destination sélectionnée, avec crédits NASA/JPL et lien vers la source.
 */
export function CinematicTravelModal({ destination, onClose, reducedMotion }: CinematicTravelModalProps) {
  if (!destination) return null;

  return (
    <PhotographicExplorer destination={destination} onClose={onClose} />
  );
}
