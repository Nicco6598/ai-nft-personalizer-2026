"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
    StackSimple as StackSimpleIcon,
    List as ListIcon,
    X as XIcon,
    Wallet as WalletIcon,
    ClockCounterClockwise as ClockCounterClockwiseIcon,
} from "@phosphor-icons/react";

const NAV_LINKS = [
    { label: "Explore", href: "/explore" },
    { label: "Create", href: "/create" },
    { label: "Docs", href: "/docs" },
];

interface NavBarProps {
    /** On the home page the parent owns wallet/history state — pass callbacks to wire them up */
    onHistoryClick?: () => void;
    isConnected?: boolean;
    address?: string;
    onWalletClick?: () => void;
    historyCount?: number;
}

export default function NavBar({
    onHistoryClick,
    isConnected,
    address,
    onWalletClick,
    historyCount = 0,
}: NavBarProps) {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [hidden, setHidden] = useState(false);
    const lastY = useRef(0);

    useEffect(() => {
        function onScroll() {
            const y = window.scrollY;
            setHidden(y > lastY.current && y > 60);
            lastY.current = y;
        }
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const isHome = pathname === "/";

    return (
        <nav
            className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 transition-transform duration-300"
            style={{
                background: "rgba(8,11,16,0.82)",
                backdropFilter: "blur(24px)",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                transform: hidden ? "translateY(-100%)" : "translateY(0)",
            }}
        >
            <div className="max-w-6xl mx-auto h-[60px] flex items-center justify-between">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-md bg-[#b2ff00] flex items-center justify-center">
                        <StackSimpleIcon size={13} weight="bold" className="text-black" />
                    </div>
                    <span className="font-bold text-[14px] text-white tracking-tight">NFTP</span>
                </Link>

                {/* Desktop links */}
                <div className="hidden md:flex items-center gap-0.5">
                    {NAV_LINKS.map(({ label, href }) => {
                        const active = pathname === href;
                        return (
                            <Link
                                key={label}
                                href={href}
                                className="px-4 py-1.5 text-[11px] font-semibold tracking-widest uppercase transition-all"
                                style={{
                                    color: active ? "#000" : "rgba(255,255,255,0.4)",
                                    background: active ? "#b2ff00" : "transparent",
                                    border: active ? "none" : "1px solid transparent",
                                }}
                                onMouseEnter={e => {
                                    if (!active) (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.8)";
                                }}
                                onMouseLeave={e => {
                                    if (!active) (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)";
                                }}
                            >
                                {label}
                            </Link>
                        );
                    })}
                </div>

                {/* Right controls */}
                <div className="flex items-center gap-2">
                    {/* History */}
                    {isHome ? (
                        <button
                            onClick={onHistoryClick}
                            className="relative hidden sm:flex items-center gap-2 px-3 py-1.5 text-[11px] font-semibold tracking-widest uppercase transition-all hover:text-white/70"
                            style={{
                                border: "1px solid rgba(255,255,255,0.08)",
                                color: "rgba(255,255,255,0.35)",
                            }}
                        >
                            <ClockCounterClockwiseIcon size={12} weight="fill" />
                            History
                            {historyCount > 0 && (
                                <span
                                    className="absolute -top-1.5 -right-1.5 w-4 h-4 text-[9px] font-bold flex items-center justify-center text-black"
                                    style={{ background: "#b2ff00" }}
                                >
                                    {historyCount}
                                </span>
                            )}
                        </button>
                    ) : (
                        <Link
                            href="/"
                            className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-[11px] font-semibold tracking-widest uppercase transition-all hover:text-white/70"
                            style={{
                                border: "1px solid rgba(255,255,255,0.08)",
                                color: "rgba(255,255,255,0.25)",
                            }}
                        >
                            <ClockCounterClockwiseIcon size={12} weight="fill" />
                            History
                        </Link>
                    )}

                    {/* Wallet */}
                    <button
                        onClick={onWalletClick}
                        className="flex items-center gap-2 px-4 py-1.5 text-[11px] font-semibold tracking-widest uppercase transition-all"
                        style={isConnected ? {
                            background: "#b2ff00",
                            color: "#000",
                        } : {
                            border: "1px solid rgba(255,255,255,0.08)",
                            color: "rgba(255,255,255,0.45)",
                        }}
                    >
                        <WalletIcon size={12} weight="fill" />
                        <span className="hidden sm:inline">
                            {isConnected && address
                                ? `${address.slice(0, 6)}…${address.slice(-4)}`
                                : "Connect"}
                        </span>
                    </button>

                    {/* Hamburger */}
                    <button
                        onClick={() => setMobileOpen(o => !o)}
                        className="md:hidden w-8 h-8 flex items-center justify-center transition-all"
                        style={{ border: "1px solid rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}
                        aria-label="Toggle menu"
                    >
                        {mobileOpen
                            ? <XIcon size={15} weight="bold" />
                            : <ListIcon size={15} weight="bold" />}
                    </button>
                </div>
            </div>

            {/* Mobile drawer */}
            <div
                className="md:hidden overflow-hidden transition-all duration-300 ease-in-out"
                style={{
                    maxHeight: mobileOpen ? "280px" : "0px",
                    opacity: mobileOpen ? 1 : 0,
                    borderTop: mobileOpen ? "1px solid rgba(255,255,255,0.05)" : "none",
                }}
            >
                <div className="py-4 flex flex-col gap-0.5">
                    {NAV_LINKS.map(({ label, href }) => {
                        const active = pathname === href;
                        return (
                            <Link
                                key={label}
                                href={href}
                                onClick={() => setMobileOpen(false)}
                                className="text-left px-4 py-3 text-[12px] font-semibold tracking-widest uppercase transition-all w-full block"
                                style={{ color: active ? "#b2ff00" : "rgba(255,255,255,0.4)" }}
                            >
                                {label}
                            </Link>
                        );
                    })}
                    <div className="h-px mx-4 my-1" style={{ background: "rgba(255,255,255,0.06)" }} />
                    {isHome && (
                        <button
                            onClick={() => { onHistoryClick?.(); setMobileOpen(false); }}
                            className="text-left px-4 py-3 text-[12px] font-semibold tracking-widest uppercase transition-all w-full flex items-center gap-2"
                            style={{ color: "rgba(255,255,255,0.4)" }}
                        >
                            <ClockCounterClockwiseIcon size={13} weight="fill" />
                            History {historyCount > 0 && `(${historyCount})`}
                        </button>
                    )}
                    <button
                        onClick={() => { onWalletClick?.(); setMobileOpen(false); }}
                        className="text-left px-4 py-3 text-[12px] font-semibold tracking-widest uppercase transition-all w-full flex items-center gap-2"
                        style={{ color: isConnected ? "#b2ff00" : "rgba(255,255,255,0.4)" }}
                    >
                        <WalletIcon size={13} weight="fill" />
                        {isConnected && address
                            ? `${address.slice(0, 6)}…${address.slice(-4)}`
                            : "Connect Wallet"}
                    </button>
                </div>
            </div>
        </nav>
    );
}
