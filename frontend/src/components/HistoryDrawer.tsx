"use client";

import { useEffect, useRef, useState } from "react";
import { useAppStore, HistoryItem } from "@/lib/store";
import {
    XIcon,
    ClockCounterClockwiseIcon,
    TrashIcon,
    CubeIcon,
    ArrowCounterClockwiseIcon,
    ImageIcon,
    TagIcon,
    CalendarBlankIcon,
} from "@phosphor-icons/react";
import Image from "next/image";

interface HistoryDrawerProps {
    open: boolean;
    onClose: () => void;
}

function timeAgo(ts: number): string {
    const diff = Date.now() - ts;
    const secs = Math.floor(diff / 1000);
    if (secs < 60) return "just now";
    const mins = Math.floor(secs / 60);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
}

function formatDate(ts: number): string {
    return new Date(ts).toLocaleDateString("en-US", {
        month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
    });
}

interface HistoryCardProps {
    item: HistoryItem;
    index: number;
    onLoad: (item: HistoryItem) => void;
    onDelete: (id: string) => void;
}

function HistoryCard({ item, index, onLoad, onDelete }: HistoryCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [confirmDelete, setConfirmDelete] = useState(false);

    // Staggered entrance animation
    useEffect(() => {
        const el = cardRef.current;
        if (!el) return;
        (async () => {
            const { gsap } = await import("gsap");
            gsap.fromTo(el,
                { opacity: 0, y: 16, scale: 0.97 },
                { opacity: 1, y: 0, scale: 1, duration: 0.38, ease: "power2.out", delay: index * 0.06 }
            );
        })();
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirmDelete) {
            onDelete(item.id);
        } else {
            setConfirmDelete(true);
            // auto-cancel after 2.5s
            setTimeout(() => setConfirmDelete(false), 2500);
        }
    };

    return (
        <div
            ref={cardRef}
            className="group relative rounded-2xl overflow-hidden"
            style={{
                background: "rgba(255,255,255,0.025)",
                border: "1px solid rgba(255,255,255,0.07)",
                opacity: 0, // GSAP will animate in
                transition: "border-color 0.2s ease, background 0.2s ease",
            }}
            onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(178,255,0,0.18)";
                (e.currentTarget as HTMLElement).style.background = "rgba(178,255,0,0.025)";
            }}
            onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)";
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.025)";
            }}
        >
            {/* Main clickable area */}
            <button
                onClick={() => onLoad(item)}
                className="w-full text-left"
                style={{ display: "block" }}
            >
                {/* Top row: thumbnail + info */}
                <div className="flex items-start gap-3 p-3.5">
                    {/* Thumbnail */}
                    <div
                        className="relative flex-shrink-0 rounded-xl overflow-hidden"
                        style={{
                            width: 64, height: 64,
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.07)",
                        }}
                    >
                        {item.imageDataUrl ? (
                            <Image
                                src={item.imageDataUrl}
                                alt={item.metadata.name}
                                fill
                                className="object-cover"
                                sizes="64px"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <ImageIcon size={20} weight="duotone" style={{ color: "rgba(255,255,255,0.12)" }} />
                            </div>
                        )}
                        {/* 3D badge */}
                        <div
                            className="absolute bottom-1 right-1 text-[8px] font-bold px-1 rounded"
                            style={{ background: "rgba(8,11,16,0.8)", color: "rgba(178,255,0,0.7)", backdropFilter: "blur(4px)" }}
                        >
                            3D
                        </div>
                    </div>

                    {/* Text info */}
                    <div className="flex-1 min-w-0 pt-0.5">
                        <p
                            className="text-[14px] font-bold text-white truncate leading-tight mb-1"
                            style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
                        >
                            {item.metadata.name}
                        </p>
                        <p className="text-[11px] text-white/35 leading-relaxed line-clamp-2">
                            {item.metadata.description}
                        </p>
                    </div>
                </div>

                {/* Bottom bar: meta info + load hint */}
                <div
                    className="flex items-center justify-between px-3.5 pb-3"
                >
                    <div className="flex items-center gap-3">
                        {/* Timestamp */}
                        <div className="flex items-center gap-1">
                            <CalendarBlankIcon size={10} style={{ color: "rgba(255,255,255,0.2)" }} />
                            <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>
                                {timeAgo(item.createdAt)}
                            </span>
                        </div>
                        <span className="w-px h-3" style={{ background: "rgba(255,255,255,0.08)" }} />
                        {/* Trait count */}
                        <div className="flex items-center gap-1">
                            <TagIcon size={10} style={{ color: "rgba(255,255,255,0.2)" }} />
                            <span className="text-[10px]" style={{ color: "rgba(255,255,255,0.2)" }}>
                                {item.metadata.attributes.length} traits
                            </span>
                        </div>
                    </div>

                    {/* Load button */}
                    <div
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{
                            background: "rgba(178,255,0,0.08)",
                            border: "1px solid rgba(178,255,0,0.2)",
                            color: "#b2ff00",
                            fontSize: 10,
                            fontWeight: 700,
                        }}
                    >
                        <ArrowCounterClockwiseIcon size={10} weight="bold" />
                        Load
                    </div>
                </div>
            </button>

            {/* Trait pills (max 4) */}
            {item.metadata.attributes.length > 0 && (
                <div
                    className="flex flex-wrap gap-1.5 px-3.5 pb-3.5"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: 10 }}
                >
                    {item.metadata.attributes.slice(0, 4).map(attr => (
                        <span
                            key={attr.trait_type}
                            className="text-[9px] font-semibold px-2 py-0.5 rounded-full"
                            style={{
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                color: "rgba(255,255,255,0.35)",
                                letterSpacing: "0.04em",
                            }}
                        >
                            {attr.trait_type}: {attr.value}
                        </span>
                    ))}
                    {item.metadata.attributes.length > 4 && (
                        <span
                            className="text-[9px] font-semibold px-2 py-0.5 rounded-full"
                            style={{
                                background: "rgba(255,255,255,0.03)",
                                border: "1px solid rgba(255,255,255,0.06)",
                                color: "rgba(255,255,255,0.2)",
                            }}
                        >
                            +{item.metadata.attributes.length - 4}
                        </span>
                    )}
                </div>
            )}

            {/* Delete button (absolute top-right) */}
            <button
                onClick={handleDeleteClick}
                className="absolute top-2.5 right-2.5 w-6 h-6 flex items-center justify-center rounded-lg
                           opacity-0 group-hover:opacity-100 transition-all duration-200"
                style={{
                    background: confirmDelete ? "rgba(239,68,68,0.18)" : "rgba(255,255,255,0.06)",
                    border: `1px solid ${confirmDelete ? "rgba(239,68,68,0.35)" : "rgba(255,255,255,0.09)"}`,
                    color: confirmDelete ? "#f87171" : "rgba(255,255,255,0.3)",
                }}
                title={confirmDelete ? "Click again to confirm" : "Delete"}
            >
                <TrashIcon size={10} weight="bold" />
            </button>

        </div>
    );
}

export default function HistoryDrawer({ open, onClose }: HistoryDrawerProps) {
    const { history, clearHistory, loadFromHistory } = useAppStore();
    const drawerRef = useRef<HTMLElement>(null);

    const deleteItem = (id: string) => {
        useAppStore.setState(s => ({ history: s.history.filter(h => h.id !== id) }));
    };

    const handleLoad = (item: HistoryItem) => {
        loadFromHistory(item);
        onClose();
    };

    // Trap focus + ESC
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                aria-hidden="true"
                style={{
                    position: "fixed", inset: 0, zIndex: 40,
                    background: "rgba(0,0,0,0.65)",
                    backdropFilter: "blur(6px)",
                    WebkitBackdropFilter: "blur(6px)",
                    opacity: open ? 1 : 0,
                    pointerEvents: open ? "auto" : "none",
                    transition: "opacity 0.28s ease",
                }}
            />

            {/* Drawer */}
            <aside
                ref={drawerRef}
                aria-label="Generation history"
                style={{
                    position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 50,
                    width: "min(400px, 94vw)",
                    background: "#0d1118",
                    borderLeft: "1px solid rgba(255,255,255,0.07)",
                    transform: open ? "translateX(0)" : "translateX(100%)",
                    transition: "transform 0.32s cubic-bezier(0.4,0,0.2,1)",
                    boxShadow: open ? "-32px 0 80px rgba(0,0,0,0.6)" : "none",
                    display: "flex", flexDirection: "column",
                    overflow: "hidden",
                }}
            >
                {/* ── Header ── */}
                <div
                    style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "18px 20px 16px",
                        borderBottom: "1px solid rgba(255,255,255,0.06)",
                        flexShrink: 0,
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div
                            style={{
                                width: 30, height: 30, borderRadius: 10,
                                background: "rgba(178,255,0,0.08)",
                                border: "1px solid rgba(178,255,0,0.18)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                            }}
                        >
                            <ClockCounterClockwiseIcon size={14} weight="fill" style={{ color: "#b2ff00" }} />
                        </div>
                        <div>
                            <p style={{ fontSize: 14, fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>
                                Generation History
                            </p>
                            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", marginTop: 1 }}>
                                {history.length > 0
                                    ? `${history.length} of ${10} saved locally`
                                    : "No generations yet"}
                            </p>
                        </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {history.length > 0 && (
                            <button
                                onClick={clearHistory}
                                style={{
                                    display: "flex", alignItems: "center", gap: 5,
                                    padding: "5px 10px", borderRadius: 8,
                                    background: "rgba(239,68,68,0.06)",
                                    border: "1px solid rgba(239,68,68,0.15)",
                                    color: "rgba(248,113,113,0.65)",
                                    fontSize: 11, fontWeight: 600,
                                    cursor: "pointer",
                                    transition: "all 0.2s",
                                }}
                                onMouseEnter={e => {
                                    (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.12)";
                                    (e.currentTarget as HTMLElement).style.color = "#f87171";
                                }}
                                onMouseLeave={e => {
                                    (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.06)";
                                    (e.currentTarget as HTMLElement).style.color = "rgba(248,113,113,0.65)";
                                }}
                                title="Clear all history"
                            >
                                <TrashIcon size={11} weight="bold" />
                                Clear all
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            style={{
                                width: 32, height: 32, borderRadius: 10,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                background: "rgba(255,255,255,0.04)",
                                border: "1px solid rgba(255,255,255,0.08)",
                                color: "rgba(255,255,255,0.4)",
                                cursor: "pointer",
                                transition: "all 0.2s",
                            }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)";
                                (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)";
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                                (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)";
                            }}
                            aria-label="Close history"
                        >
                            <XIcon size={14} weight="bold" />
                        </button>
                    </div>
                </div>

                {/* ── Content ── */}
                <div
                    style={{
                        flex: 1, overflowY: "auto", padding: "16px 16px 20px",
                        scrollbarWidth: "thin",
                        scrollbarColor: "rgba(255,255,255,0.08) transparent",
                    }}
                >
                    {history.length === 0 ? (
                        /* Empty state */
                        <div
                            style={{
                                display: "flex", flexDirection: "column",
                                alignItems: "center", justifyContent: "center",
                                gap: 14, padding: "60px 20px",
                                textAlign: "center",
                            }}
                        >
                            <div
                                style={{
                                    width: 56, height: 56, borderRadius: 18,
                                    background: "rgba(255,255,255,0.03)",
                                    border: "1px solid rgba(255,255,255,0.06)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                }}
                            >
                                <CubeIcon size={24} weight="duotone" style={{ color: "rgba(255,255,255,0.1)" }} />
                            </div>
                            <div>
                                <p style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.2)" }}>
                                    No generations yet
                                </p>
                                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.1)", marginTop: 5, lineHeight: 1.5 }}>
                                    Generate your first 3D NFT<br />and it will appear here
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {/* Most recent label */}
                            <p style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.18)", letterSpacing: "0.1em", paddingLeft: 2, marginBottom: 2 }}>
                                RECENT — {formatDate(history[0].createdAt)}
                            </p>

                            {history.map((item, i) => (
                                <HistoryCard
                                    key={item.id}
                                    item={item}
                                    index={i}
                                    onLoad={handleLoad}
                                    onDelete={deleteItem}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Footer ── */}
                {history.length > 0 && (
                    <div
                        style={{
                            padding: "12px 20px",
                            borderTop: "1px solid rgba(255,255,255,0.05)",
                            flexShrink: 0,
                        }}
                    >
                        <p style={{ fontSize: 10, color: "rgba(255,255,255,0.13)", textAlign: "center" }}>
                            History is saved locally in your browser · Max 10 entries
                        </p>
                    </div>
                )}
            </aside>
        </>
    );
}
