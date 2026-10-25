'use client';

import dynamic from 'next/dynamic';

const SpaceHubPage = dynamic(
  () => import('@/components/hub/SpaceHubPage').then((mod) => mod.SpaceHubPage),
  {
    ssr: false,
    loading: () => (
      <div className="w-screen h-screen bg-black flex flex-col items-center justify-center text-cyan-400 font-mono text-sm tracking-[0.3em] gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
        <span>INITIALISATION DU HUB SPATIAL...</span>
      </div>
    ),
  }
);

export default function Home() {
  return <SpaceHubPage />;
}
