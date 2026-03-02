"use client";

import { useEffect } from "react";

export default function LenisWrapper({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        let lenisInstance: { raf: (t: number) => void; destroy: () => void } | null = null;
        let rafId: number;

        async function init() {
            const { default: Lenis } = await import("lenis");
            lenisInstance = new Lenis({ lerp: 0.08, smoothWheel: true });
            function raf(time: number) {
                lenisInstance!.raf(time);
                rafId = requestAnimationFrame(raf);
            }
            rafId = requestAnimationFrame(raf);
        }

        init();

        return () => {
            cancelAnimationFrame(rafId);
            lenisInstance?.destroy();
        };
    }, []);

    return <>{children}</>;
}
