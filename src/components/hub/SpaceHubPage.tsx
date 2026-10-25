'use client';

import React, { useState, useEffect } from 'react';
import { StationFrame } from './StationFrame';
import { UniverseCanvas } from './UniverseCanvas';
import { PlanetLabels } from './PlanetLabels';
import { NavigationBar } from './NavigationBar';
import { SpaceHubCard } from './SpaceHubCard';
import { PlanetInfoCard } from './PlanetInfoCard';
import { DestinationSelectorModal } from './DestinationSelectorModal';
import { CinematicTravelModal } from './CinematicTravelModal';
import { ProfileSettingsModal } from './ProfileSettingsModal';
import { Destination, MAIN_DESTINATIONS, ALL_DESTINATIONS } from '@/data/destinations';

export function SpaceHubPage() {
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [hoveredDestinationId, setHoveredDestinationId] = useState<string | null>(null);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [travelingDestination, setTravelingDestination] = useState<Destination | null>(null);
  const [currentNavTab, setCurrentNavTab] = useState<'solar-system' | 'explore' | 'experiments'>('solar-system');
  const [reducedMotion, setReducedMotion] = useState(false);

  // Check prefers-reduced-motion media query and optional URL query state on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        setReducedMotion(mediaQuery.matches);
        const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
        mediaQuery.addEventListener('change', handleChange);
      }

      const params = new URLSearchParams(window.location.search);
      if (params.get('modal') === 'selector') {
        setIsSelectorOpen(true);
      }
      const planetParam = params.get('planet');
      if (planetParam) {
        const target = ALL_DESTINATIONS.find((d) => d.id === planetParam);
        if (target) setSelectedDestination(target);
      }
    }
  }, []);

  const handleSelectTab = (tab: 'solar-system' | 'explore' | 'experiments') => {
    setCurrentNavTab(tab);
    if (tab === 'solar-system') {
      setSelectedDestination(null);
    } else if (tab === 'explore') {
      setIsSelectorOpen(true);
    } else if (tab === 'experiments') {
      // If Mars is already selected, launch directly; otherwise select Mars to show its info card
      const mars = ALL_DESTINATIONS.find((d) => d.id === 'mars') || MAIN_DESTINATIONS[0];
      if (selectedDestination?.id === 'mars') {
        handleStartTravel(mars);
      } else {
        setSelectedDestination(mars);
      }
    }
  };

  const handleSelectDestination = (dest: Destination) => {
    setSelectedDestination(dest);
  };

  const handleStartTravel = (dest: Destination) => {
    setTravelingDestination(dest);
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-black text-white">
      {/* Station Visual Frame Container */}
      <StationFrame>
        {/* Three.js R3F Interactive 3D Canvas */}
        <UniverseCanvas
          selectedDestinationId={selectedDestination?.id || null}
          hoveredDestinationId={hoveredDestinationId}
          reducedMotion={reducedMotion}
          onSelectDestination={handleSelectDestination}
          onHoverDestination={setHoveredDestinationId}
        />

        {/* Floating Planet Badges and Labels for the 5 Main Celestial Destinations */}
        <PlanetLabels
          selectedId={selectedDestination?.id || null}
          hoveredId={hoveredDestinationId}
          onSelect={handleSelectDestination}
          onHover={setHoveredDestinationId}
        />

        {/* Top-Right Navigation Bar */}
        <NavigationBar
          currentTab={currentNavTab}
          onSelectTab={handleSelectTab}
          onOpenProfile={() => setIsProfileOpen(true)}
          reducedMotion={reducedMotion}
          onToggleReducedMotion={() => setReducedMotion((prev) => !prev)}
        />

        {/* Bottom-Right Space Hub Glass Card */}
        <SpaceHubCard
          onChooseDestination={() => setIsSelectorOpen(true)}
          reducedMotion={reducedMotion}
        />

        {/* Selected Planet Scientific Information Overlay */}
        <PlanetInfoCard
          destination={selectedDestination}
          onClose={() => setSelectedDestination(null)}
          onTravel={handleStartTravel}
        />
      </StationFrame>

      {/* Destination Selector Catalog Drawer / Modal (22 Destinations) */}
      <DestinationSelectorModal
        isOpen={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
        onSelectDestination={(dest) => {
          handleSelectDestination(dest);
          setIsSelectorOpen(false);
        }}
      />

      {/* Cinematic Travel Sequence Modal */}
      <CinematicTravelModal
        destination={travelingDestination}
        onClose={() => setTravelingDestination(null)}
        reducedMotion={reducedMotion}
      />

      {/* Profile & Settings Modal */}
      <ProfileSettingsModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        reducedMotion={reducedMotion}
        onToggleReducedMotion={() => setReducedMotion((prev) => !prev)}
      />
    </main>
  );
}
