"use client";

import React, { useState, useMemo } from "react";
import {
  UniverseMapOverview,
  UniverseMapOverviewProps,
} from "./UniverseMapOverview";
import { ExoplanetSciencePanel } from "./ExoplanetSciencePanel";
import {
  getDestinationById,
  getSmartObjects,
  CATEGORIES,
  UniverseCategory,
  UniverseCatalogDestination,
} from "@/data/universe-catalog";

export function UniverseMapPage({
  initialCategory = "solar-system",
}: {
  initialCategory?: UniverseCategory;
}) {
  const [activeCategory, setActiveCategory] =
    useState<UniverseCategory>(initialCategory);
  const [selectedDestination, setSelectedDestination] =
    useState<UniverseCatalogDestination | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const items = useMemo(() => {
    const all = getSmartObjects(
      activeCategory === "solar-system" ? "Système solaire" : "Voie lactée",
    );
    if (!searchQuery) return all;
    const q = searchQuery.toLowerCase();
    return all.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.nameEn.toLowerCase().includes(q) ||
        (d.scientificAttribution &&
          d.scientificAttribution.toLowerCase().includes(q)),
    );
  }, [activeCategory, searchQuery]);

  const activeCategoryLabel =
    CATEGORIES.find((c) => c.id === activeCategory)?.label || "Système solaire";

  const handleCategorySelect = (cat: UniverseCategory) => {
    setActiveCategory(cat);
    setSelectedDestination(null);
  };

  const handleSelect = (dest: UniverseCatalogDestination) => {
    setSelectedDestination(dest);
  };

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#030812] text-white">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-40 px-4 py-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <span
                className="text-2xl"
                role="img"
                aria-label="Bannière carte univers"
              >
                🌌
              </span>
              <div>
                <h1 className="text-lg md:text-xl font-bold tracking-[0.15em] uppercase text-white">
                  CARTE DE L'UNIVERS
                </h1>
                <p className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">
                  {activeCategoryLabel} · {items.length} corps
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </span>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher une destination..."
                  className="pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-400/50 w-48 sm:w-64 transition-all"
                  aria-label="Rechercher une destination"
                />
              </div>

              <div className="flex gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-mono tracking-widest uppercase transition-all duration-300 border ${
                      activeCategory === cat.id
                        ? "bg-cyan-500/20 border-cyan-400/50 text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.2)]"
                        : "bg-white/5 border-white/10 text-slate-400 hover:border-cyan-400/30"
                    }`}
                  >
                    {cat.icon} {cat.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="absolute inset-0 pt-16 md:pt-20">
        <UniverseMapOverview
          items={items}
          activeCategory={activeCategory}
          selectedDestination={selectedDestination}
          onSelect={handleSelect}
          isMobile={isMobile}
        />
      </div>

      {selectedDestination && (
        <ExoplanetSciencePanel
          destination={selectedDestination}
          onClose={() => setSelectedDestination(null)}
          isOpen
        />
      )}
    </main>
  );
}
