/**
 * page.tsx  –  Homepage (Server Component shell)
 *
 * Layout:
 *  ┌─────────────────────────────────────────────┐
 *  │  Header  (logo + wallet connect button)      │
 *  ├────────────────────┬────────────────────────┤
 *  │  Left panel        │  Right panel            │
 *  │  • Image upload    │  • 3D model viewer      │
 *  │  • Style prompt    │    (R3F canvas)          │
 *  │  • Generate btn    │  • NFT metadata card    │
 *  └────────────────────┴────────────────────────┘
 *
 * All interactive parts are isolated in the 'use client' HomeClient component
 * so the page itself stays a Server Component for faster initial load.
 */

import HomeClient from "@/components/HomeClient";

export default function HomePage() {
  return <HomeClient />;
}
