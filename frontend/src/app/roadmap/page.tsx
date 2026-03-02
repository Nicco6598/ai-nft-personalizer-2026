import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import LenisWrapper from "@/components/LenisWrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Roadmap — NFTP",
    description: "See what's coming next for NFTP — the AI-powered NFT generator.",
};

type Status = "done" | "in-progress" | "planned";

const MILESTONES: {
    quarter: string;
    status: Status;
    items: { title: string; desc: string }[];
}[] = [
    {
        quarter: "Q4 2025 — Foundation",
        status: "done",
        items: [
            { title: "Core AI pipeline", desc: "Image → 3D model via Tripo AI + metadata via Groq." },
            { title: "IPFS pinning", desc: "Automatic asset pinning to Pinata on generation." },
            { title: "Testnet minting", desc: "One-click NFT minting on Ethereum Sepolia & Base Sepolia." },
            { title: "History drawer", desc: "Persistent session history with Zustand + localStorage." },
        ],
    },
    {
        quarter: "Q1 2026 — UX Polish",
        status: "done",
        items: [
            { title: "3D model viewer", desc: "Interactive React Three Fiber viewer with orbit controls." },
            { title: "Progress animation", desc: "Real-time generation progress steps with GSAP animations." },
            { title: "Responsive redesign", desc: "Full mobile-first layout with Tailwind CSS 4." },
            { title: "Toast notifications", desc: "Global toast system for feedback on key actions." },
        ],
    },
    {
        quarter: "Q2 2026 — Community",
        status: "in-progress",
        items: [
            { title: "Public gallery", desc: "Browse and discover NFTs minted by all NFTP users." },
            { title: "User profiles", desc: "Wallet-linked profiles showing owned collections." },
            { title: "Social sharing", desc: "Share your 3D NFT as an animated card on social media." },
            { title: "Style presets", desc: "Curated style prompts (cyberpunk, organic, minimal, etc.)." },
        ],
    },
    {
        quarter: "Q3 2026 — Mainnet",
        status: "planned",
        items: [
            { title: "Mainnet support", desc: "Ethereum and Base mainnet minting with gas estimation." },
            { title: "Batch generation", desc: "Generate entire collections from a folder of images." },
            { title: "Marketplace integration", desc: "Direct listing on OpenSea and Blur from the studio." },
            { title: "DAO governance", desc: "Community voting on feature roadmap and style packs." },
        ],
    },
];

const STATUS_CONFIG: Record<Status, { label: string; color: string }> = {
    done:          { label: "Done",        color: "#b2ff00" },
    "in-progress": { label: "In progress", color: "#14f1ff" },
    planned:       { label: "Planned",     color: "rgba(255,255,255,0.3)" },
};

export default function RoadmapPage() {
    return (
        <LenisWrapper>
            <div style={{ background: "#0d1117", minHeight: "100vh", color: "#fff" }}>
                <NavBar />

                <main className="px-6 md:px-10 pt-32 pb-32">
                    <div className="max-w-6xl mx-auto">

                        {/* ── Hero ── */}
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10 mb-28">
                            <div>
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-8 h-px" style={{ background: "#b2ff00" }} />
                                    <span className="text-[11px] font-semibold tracking-[0.18em] text-white/40 uppercase">
                                        What&apos;s coming
                                    </span>
                                </div>
                                <h1
                                    className="font-black leading-[0.92] tracking-tight"
                                    style={{ fontSize: "clamp(4rem, 10vw, 9rem)" }}
                                >
                                    Product
                                    <br />
                                    <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "#b2ff00" }}>roadmap</span>
                                </h1>
                            </div>
                            <div className="md:max-w-xs md:text-right md:pb-3">
                                <p className="text-[14px] text-white/45 leading-relaxed mb-5">
                                    Our public roadmap shows what we&apos;ve shipped, what we&apos;re building,
                                    and where we&apos;re headed next.
                                </p>
                                <a
                                    href="#"
                                    className="inline-flex items-center gap-2 text-[12px] font-semibold tracking-widest uppercase text-white/60 hover:text-[#b2ff00] transition-colors"
                                >
                                    GitHub Issues →
                                </a>
                            </div>
                        </div>

                        {/* ── Timeline ── */}
                        <div className="flex flex-col">
                            {MILESTONES.map((m, mi) => {
                                const cfg = STATUS_CONFIG[m.status];
                                return (
                                    <div
                                        key={m.quarter}
                                        className="py-10"
                                        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
                                    >
                                        {/* Quarter row */}
                                        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
                                            <div className="flex items-baseline gap-4">
                                                <span className="text-[12px] font-semibold text-white/20">
                                                    {String(mi + 1).padStart(2, "0")} /
                                                </span>
                                                <h2 className="text-[18px] font-bold text-white">{m.quarter}</h2>
                                            </div>
                                            <span
                                                className="text-[11px] font-semibold tracking-widest uppercase px-3 py-1"
                                                style={{
                                                    color: cfg.color,
                                                    border: `1px solid ${cfg.color}40`,
                                                }}
                                            >
                                                {cfg.label}
                                            </span>
                                        </div>

                                        {/* Items grid */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pl-0 md:pl-14">
                                            {m.items.map(item => (
                                                <div key={item.title} className="flex items-start gap-4">
                                                    <div
                                                        className="mt-1 w-4 h-4 flex-shrink-0 flex items-center justify-center"
                                                        style={{ border: `1px solid ${cfg.color}50` }}
                                                    >
                                                        {m.status === "done" && (
                                                            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                                                                <path d="M1 4l2 2 4-4" stroke={cfg.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                            </svg>
                                                        )}
                                                        {m.status === "in-progress" && (
                                                            <div className="w-1.5 h-1.5" style={{ background: cfg.color }} />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-[13px] font-semibold text-white mb-1">{item.title}</p>
                                                        <p className="text-[12px] text-white/35 leading-relaxed">{item.desc}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Bottom border */}
                            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} />
                        </div>

                        {/* ── Feedback CTA ── */}
                        <div
                            className="mt-16 p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
                            style={{ border: "1px solid rgba(178,255,0,0.12)", background: "#161b27" }}
                        >
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-5 h-px" style={{ background: "#b2ff00" }} />
                                    <span className="text-[11px] font-semibold tracking-[0.18em] text-white/30 uppercase">Contribute</span>
                                </div>
                                <p className="text-[15px] font-bold text-white mb-1">Have a feature idea?</p>
                                <p className="text-[12px] text-white/35 leading-relaxed">
                                    Open an issue on GitHub or reach out on Discord — we read everything.
                                </p>
                            </div>
                            <div className="flex items-center gap-3 flex-wrap">
                                <a
                                    href="#"
                                    className="px-6 py-2.5 text-[12px] font-bold tracking-widest uppercase transition-all hover:opacity-90"
                                    style={{ background: "#b2ff00", color: "#000" }}
                                >
                                    GitHub →
                                </a>
                                <a
                                    href="#"
                                    className="px-6 py-2.5 text-[12px] font-semibold tracking-widest uppercase transition-all"
                                    style={{
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        color: "rgba(255,255,255,0.45)",
                                    }}
                                >
                                    Discord →
                                </a>
                            </div>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </LenisWrapper>
    );
}
