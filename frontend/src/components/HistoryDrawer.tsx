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

    // Staggered entrance animation
    useEffect(() => {
        const el = cardRef.current;
        if (!el) return;
        (async () => {
            const { gsap } = await import("gsap");
            gsap.fromTo(el,
                { opacity: 0, x: 20 },
                { opacity: 1, x: 0, duration: 0.3, ease: "power2.out", delay: index * 0.05 }
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
            className="group relative flex items-center overflow-hidden rounded-xl bg-white/5 border border-white/10 transition-all hover:bg-white/10 hover:border-[#b2ff00]/30 cursor-pointer"
            onClick={() => onLoad(item)}
            style={{ opacity: 0 }} // Will be animated in
        >
            {/* Thumbnail */}
            <div className="relative w-20 h-20 flex-shrink-0 bg-black/40 border-r border-white/10">
                {item.imageDataUrl ? (
                    <Image
                        src={item.imageDataUrl}
                        alt={item.metadata.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center text-white/20">
                        <ImageIcon size={24} weight="duotone" />
                    </div>
                )}
                {/* 3D badge */}
                <div className="absolute bottom-1 right-1 rounded bg-black/80 px-1 py-0.5 text-[8px] font-bold text-[#b2ff00] backdrop-blur-md">
                    3D
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 min-w-0 flex flex-col justify-center px-4 py-3">
                <div className="flex items-center justify-between mb-1">
                    <p className="truncate font-serif text-sm font-bold italic text-white leading-tight pr-2">
                        {item.metadata.name}
                    </p>
                    <span className="text-[10px] text-white/40 flex-shrink-0">
                        {timeAgo(item.createdAt)}
                    </span>
                </div>

                <p className="line-clamp-1 text-xs text-white/50 mb-2">
                    {item.metadata.description}
                </p>

                {/* Tags & Action row */}
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-white/30 text-[10px]">
                        <TagIcon size={12} />
                        <span>{item.metadata.attributes.length} traits</span>
                    </div>

                    <span className="w-px h-3 bg-white/10"></span>

                    <div className="text-[10px] font-bold text-[#b2ff00] opacity-0 transition-opacity group-hover:opacity-100 flex items-center gap-1">
                        <ArrowCounterClockwiseIcon size={12} weight="bold" />
                        Load
                    </div>
                </div>
            </div>

            {/* Quick Actions (Delete) */}
            <div className="absolute top-0 right-0 bottom-0 flex items-center justify-center bg-black/40 backdrop-blur-md border-l border-white/5 opacity-0 group-hover:opacity-100 transition-all px-3">
                <button
                    onClick={handleDeleteClick}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${confirmDelete
                            ? "bg-red-500/20 border-red-500/40 text-red-500"
                            : "bg-white/5 border-white/10 text-white/40 hover:bg-white/10 hover:text-white"
                        }`}
                    title={confirmDelete ? "Click to confirm deletion" : "Delete"}
                >
                    <TrashIcon size={14} weight={confirmDelete ? "fill" : "bold"} />
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

    // Trap focus + ESC
    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    // Grouping logic for hierarchy
    const groupedHistory = useMemo(() => {
        const groups: { label: string; items: HistoryItem[] }[] = [
            { label: "Today", items: [] },
            { label: "Yesterday", items: [] },
            { label: "Older", items: [] },
        ];

        const now = new Date();
        const todayStr = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
        const yesterdayStr = todayStr - 86400000;

        history.forEach(item => {
            if (item.createdAt >= todayStr) {
                groups[0].items.push(item);
            } else if (item.createdAt >= yesterdayStr) {
                groups[1].items.push(item);
            } else {
                groups[2].items.push(item);
            }
        });

        // Filter out empty groups
        return groups.filter(g => g.items.length > 0);
    }, [history]);

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                aria-hidden="true"
                className={`fixed inset-0 z-40 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
            />

            {/* Drawer */}
            <aside
                aria-label="Generation history"
                className={`fixed top-0 right-0 bottom-0 z-50 flex w-full max-w-md flex-col border-l border-white/10 bg-[#0d1118] shadow-2xl transition-transform duration-300 ease-in-out sm:w-[420px] max-w-[100vw] ${open ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {/* ── Header ── */}
                <div className="flex shrink-0 items-center justify-between border-b border-white/10 px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#b2ff00]/30 bg-[#b2ff00]/10 text-[#b2ff00]">
                            <ClockCounterClockwiseIcon size={20} weight="fill" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold leading-tight text-white">History</h2>
                            <p className="text-xs text-white/40">
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
                                className="flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 transition-colors hover:bg-red-500/20 hover:text-red-300"
                                title="Clear all history"
                            >
                                <TrashIcon size={14} weight="bold" />
                                <span className="hidden sm:inline">Clear all</span>
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
                            aria-label="Close history"
                        >
                            <XIcon size={16} weight="bold" />
                        </button>
                    </div>
                </div>

                {/* ── Content ── */}
                <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
                    {history.length === 0 ? (
                        /* Empty state */
                        <div className="flex h-full flex-col items-center justify-center text-center opacity-80">
                            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/5 text-white/20">
                                <CubeIcon size={40} weight="duotone" />
                            </div>
                            <h3 className="mb-1 text-base font-bold text-white/60">No history found</h3>
                            <p className="max-w-[200px] text-sm text-white/40">
                                Generate your first 3D NFT and it will appear here automatically.
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6">
                            {groupedHistory.map((group) => (
                                <div key={group.label} className="flex flex-col gap-3">
                                    <h3 className="text-xs font-bold tracking-wider text-white/30 uppercase pl-1">
                                        {group.label}
                                    </h3>
                                    <div className="flex flex-col gap-2">
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
                    <div className="shrink-0 border-t border-white/10 bg-black/20 py-4 text-center">
                        <p className="text-xs text-white/30">
                            Items are temporarily cached in your local browser · Max 10 entries limit
                        </p>
                    </div>
                )}
            </aside>
        </>
    );
}
