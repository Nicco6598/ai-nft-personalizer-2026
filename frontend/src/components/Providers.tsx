/**
 * Providers.tsx  –  'use client' root wrapper
 * Mounts WagmiProvider + QueryClientProvider so every page can
 * use hooks (useAccount, wagmi, react-query) without extra boilerplate.
 */
"use client";

import { WagmiProvider } from "wagmi";
import { QueryClientProvider } from "@tanstack/react-query";
import { wagmiConfig } from "@/lib/wagmi-config";
import { queryClient } from "@/lib/query-client";
import { ToastProvider } from "@/components/ToastProvider";
import { ReactNode } from "react";

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
                <ToastProvider>
                    {children}
                </ToastProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
