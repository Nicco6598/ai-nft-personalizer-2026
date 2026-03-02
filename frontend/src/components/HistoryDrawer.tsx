"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { useAppStore, HistoryItem } from "@/lib/store";
import {
    XIcon,
    ClockCounterClockwiseIcon,
    TrashIcon,
    CubeIcon,
    ArrowCounterClockwiseIcon,
    ImageIcon,
    TagIcon,
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

interface HistoryCardProps {
    item: HistoryItem;
    index: number;
    onLoad: (item: HistoryItem) => void;
    onDelete: (id: string) => void;
}

function HistoryCard({ item, index, onLoad, onDelete }: HistoryCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [confirmDelete, setConfirmDelete] = useState(false);

    useEffect(() => {
        const el = cardRef.current;
        if (!el) return;
        (async () => {
            const { gsap } = await import("gsap");
            gsap.fromTo(el,
                { opacity: 0, x: 24 },
                { opacity: 1, x: 0, duration: 0.32, ease: "power2.out", delay: index * 0.05 }
            );
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirmDelete) {
            onDelete(item.id);
        } else {
            setConfirmDelete(true);
            setTimeout(() => setConfirmDelete(false), 2500);
        }
    };

    return (
        <div
            ref={cardRef}
            className="group relative flex items-stretch overflow-hidden border-b border-white/[0.06] bg-[#161b27] transition-colors hover:bg-[#1c2333] cursor-pointer"
            onClick={() => onLoad(item)}
            style={{ opacity: 0 }}
        >
            {/* Lime left accent bar on hover */}
            <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-[#b2ff00] opacity-0 transition-opacity group-hover:opacity-100" />

            {/* Thumbnail */}
            <div className="relative w-[68px] flex-shrink-0 bg-black/40 border-r border-white/[0.06]">
                {item.imageDataUrl ? (
                    <Image
                        src={item.imageDataUrl}
                        alt={item.metadata.name}
                        fill
                        className="object-cover"
                        sizes="68px"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-white/20">
                        <ImageIcon size={22} weight="duotone" />
                    </div>
                )}
                {/* 3D badge — sharp corners, lime on black */}
                <div className="absolute bottom-1.5 right-1.5 bg-[#b2ff00] px-1 py-px text-[7px] font-black tracking-widest text-black uppercase">
                    3D
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 flex flex-col justify-center px-4 py-3 gap-1">
                <div className="flex items-start justify-between gap-2">
                    <p
                        className="truncate text-sm font-bold text-white leading-snug"
                        style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}
                    >
                        {item.metadata.name}
                    </p>
                    <span className="text-[10px] text-white/30 flex-shrink-0 tabular-nums mt-px">
                        {timeAgo(item.createdAt)}
                    </span>
                </div>

                <p className="line-clamp-1 text-[11px] text-white/40 leading-snug">
                    {item.metadata.description}
                </p>

                <div className="flex items-center gap-3 mt-0.5">
                    <div className="flex items-center gap-1 text-white/25 text-[10px] tracking-wide">
                        <TagIcon size={10} />
                        <span>{item.metadata.attributes.length} traits</span>
                    </div>
                    <span className="w-px h-3 bg-white/10" />
                    <div className="flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase text-[#b2ff00] opacity-0 transition-opacity group-hover:opacity-100">
                        <ArrowCounterClockwiseIcon size={11} weight="bold" />
                        Load
                    </div>
                </div>
            </div>

            {/* Delete button — appears on hover */}
            <div className="absolute top-0 right-0 bottom-0 flex items-center px-3 bg-[#0d1117]/80 backdrop-blur-sm border-l border-white/[0.06] opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                    onClick={handleDeleteClick}
                    className={`flex h-7 w-7 items-center justify-center border transition-colors ${
                        confirmDelete
                            ? "bg-red-500/20 border-red-500/40 text-red-400"
                            : "bg-white/5 border-white/10 text-white/35 hover:bg-white/10 hover:text-white"
                    }`}
                    title={confirmDelete ? "Confirm delete" : "Delete"}
                >
                    <TrashIcon size={13} weight={confirmDelete ? "fill" : "bold"} />
                </button>
            </div>
        </div>
    );
}

export default function HistoryDrawer({ open, onClose }: HistoryDrawerProps) {
    const { history, clearHistory, loadFromHistory } = useAppStore();

    const deleteItem = (id: string) => {
        useAppStore.setState(s => ({ history: s.history.filter(h => h.id !== id) }));
    };

    const handleLoad = (item: HistoryItem) => {
        loadFromHistory(item);
        onClose();
    };

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    const groupedHistory = useMemo(() => {
        const groups: { label: string; items: HistoryItem[] }[] = [
            { label: "Today", items: [] },
            { label: "Yesterday", items: [] },
            { label: "Older", items: [] },
        ];
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayTs = todayStart.getTime();
        const yesterdayTs = todayTs - 86400000;

        history.forEach(item => {
            if (item.createdAt >= todayTs) groups[0].items.push(item);
            else if (item.createdAt >= yesterdayTs) groups[1].items.push(item);
            else groups[2].items.push(item);
        });

        return groups.filter(g => g.items.length > 0);
    }, [history]);

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                aria-hidden="true"
                className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
                    open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                }`}
            />

            {/* Drawer panel */}
            <aside
                aria-label="Generation history"
                className={`fixed top-0 right-0 bottom-0 z-50 flex w-full flex-col bg-[#0d1117] border-l border-white/[0.06] shadow-[−8px_0_40px_rgba(0,0,0,0.6)] transition-transform duration-300 ease-in-out sm:w-[400px] max-w-[100vw] ${
                    open ? "translate-x-0" : "translate-x-full"
                }`}
            >
                {/* ── Header ── */}
                <div className="flex shrink-0 items-center justify-between border-b border-white/[0.06] px-6 py-5">
                    <div className="flex items-center gap-3">
                        {/* Icon — sharp corners, lime accent */}
                        <div className="flex h-9 w-9 items-center justify-center border border-[#b2ff00]/30 bg-[#b2ff00]/10 text-[#b2ff00]">
                            <ClockCounterClockwiseIcon size={18} weight="fill" />
                        </div>
                        <div>
                            {/* Eyebrow — Scandellari style */}
                            <div className="flex items-center gap-2 mb-0.5">
                                <div className="w-5 h-px bg-[#b2ff00]" />
                                <span className="text-[9px] font-bold tracking-[0.18em] uppercase text-white/40">
                                    History
                                </span>
                            </div>
                            <p className="text-[11px] text-white/30">
                                {history.length > 0
                                    ? `${history.length} items saved locally`
                                    : "No recent generations"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {history.length > 0 && (
                            <button
                                onClick={clearHistory}
                                className="flex items-center gap-1.5 border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase text-red-400 transition-colors hover:bg-red-500/20 hover:text-red-300"
                                title="Clear all history"
                            >
                                <TrashIcon size={12} weight="bold" />
                                Clear
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="flex h-8 w-8 items-center justify-center border border-white/[0.08] bg-white/[0.04] text-white/40 transition-colors hover:bg-white/10 hover:text-white"
                            aria-label="Close history"
                        >
                            <XIcon size={15} weight="bold" />
                        </button>
                    </div>
                </div>

                {/* ── Content ── */}
                <div className="flex-1 overflow-y-auto px-5 py-5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
                    {history.length === 0 ? (
                        /* Empty state */
                        <div className="flex h-full flex-col items-center justify-center text-center gap-4">
                            <div className="flex h-16 w-16 items-center justify-center border border-white/[0.06] bg-white/[0.03] text-white/15">
                                <CubeIcon size={32} weight="duotone" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white/40 mb-1">No history found</p>
                                <p className="text-[11px] text-white/25 max-w-[200px] leading-relaxed">
                                    Generate your first 3D NFT and it will appear here automatically.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6">
                            {groupedHistory.map((group) => (
                                <div key={group.label}>
                                    {/* Group label — section divider style */}
                                    <div className="flex items-center gap-3 border-t border-white/[0.06] pt-4 mb-3">
                                        <span className="text-[9px] font-bold tracking-[0.18em] uppercase text-white/25">
                                            {group.label}
                                        </span>
                                        <div className="flex-1 h-px bg-white/[0.04]" />
                                        <span className="text-[9px] text-white/20 tabular-nums">
                                            {group.items.length}
                                        </span>
                                    </div>

                                    {/* Tiled card list — gap-px, outer border */}
                                    <div className="border border-white/[0.06] flex flex-col">
                                        {group.items.map((item, index) => (
                                            <HistoryCard
                                                key={item.id}
                                                item={item}
                                                index={index}
                                                onLoad={handleLoad}
                                                onDelete={deleteItem}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Footer ── */}
                {history.length > 0 && (
                    <div className="shrink-0 border-t border-white/[0.06] px-6 py-3">
                        <p className="text-[10px] text-white/25 tracking-wide">
                            Cached locally in browser · max 10 entries
                        </p>
                    </div>
                )}
            </aside>
        </>
    );
}
