import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import LenisWrapper from "@/components/LenisWrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Explore — NFTP",
    description: "Browse generative 3D NFTs created by the NFTP community.",
};

const MOCK_NFTS = [
    { id: 1, num: "01", name: "Cyber Relic #001", tags: ["Cyberpunk", "Gold"], accent: "#b2ff00" },
    { id: 2, num: "02", name: "Neon Skull #022", tags: ["Abstract", "Dark"], accent: "#14f1ff" },
    { id: 3, num: "03", name: "Forest Spirit #007", tags: ["Nature", "Organic"], accent: "#8b5cf6" },
    { id: 4, num: "04", name: "Glitch Totem #043", tags: ["Glitch", "Electric"], accent: "#b2ff00" },
    { id: 5, num: "05", name: "Iron Mask #011", tags: ["Metal", "Minimal"], accent: "#14f1ff" },
    { id: 6, num: "06", name: "Void Echo #058", tags: ["Space", "Dark"], accent: "#8b5cf6" },
];

const FILTERS = ["All", "Cyberpunk", "Abstract", "Nature", "Glitch", "Space"];

export default function ExplorePage() {
    return (
        <LenisWrapper>
            <div style={{ background: "#0d1117", minHeight: "100vh", color: "#fff" }}>
                <NavBar />

                <main className="px-6 md:px-10 pt-32 pb-32">
                    <div className="max-w-6xl mx-auto">

                        {/* ── Hero ── */}
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10 mb-24">
                            <div>
                                {/* Eyebrow */}
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="w-8 h-px" style={{ background: "#b2ff00" }} />
                                    <span className="text-[11px] font-semibold tracking-[0.18em] text-white/40 uppercase">
                                        Community gallery
                                    </span>
                                </div>
                                {/* Giant heading */}
                                <h1
                                    className="font-black leading-[0.92] tracking-tight"
                                    style={{ fontSize: "clamp(4rem, 10vw, 9rem)" }}
                                >
                                    Explore
                                    <br />
                                    <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "#b2ff00" }}>3D NFTs</span>
                                </h1>
                            </div>
                            {/* Right col — description */}
                            <div className="md:max-w-xs md:text-right md:pb-3">
                                <p className="text-[14px] text-white/45 leading-relaxed mb-5">
                                    Discover generative collectibles created by the NFTP community.
                                    Every asset starts from a single image.
                                </p>
                                <a
                                    href="/#studio"
                                    className="inline-flex items-center gap-2 text-[12px] font-semibold tracking-widest uppercase text-white/60 hover:text-[#b2ff00] transition-colors"
                                >
                                    Start creating <span>→</span>
                                </a>
                            </div>
                        </div>

                        {/* ── Filter bar ── */}
                        <div className="flex items-center gap-2 mb-12 flex-wrap">
                            {FILTERS.map((tag, i) => (
                                <button
                                    key={tag}
                                    className="px-4 py-1.5 text-[11px] font-semibold tracking-widest uppercase transition-all"
                                    style={{
                                        background: i === 0 ? "#b2ff00" : "transparent",
                                        color: i === 0 ? "#000" : "rgba(255,255,255,0.35)",
                                        border: i === 0 ? "1px solid #b2ff00" : "1px solid rgba(255,255,255,0.1)",
                                    }}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>

                        {/* ── Grid ── */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px"
                            style={{ border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.06)" }}>
                            {MOCK_NFTS.map(nft => (
                                <div
                                    key={nft.id}
                                    className="group cursor-pointer overflow-hidden"
                                    style={{ background: "#0d1117" }}
                                >
                                    {/* Preview area */}
                                    <div
                                        className="w-full h-52 flex items-center justify-center relative overflow-hidden"
                                        style={{ background: "#161b27" }}
                                    >
                                        <div
                                            className="w-20 h-20 rounded-full opacity-15 group-hover:opacity-35 transition-all duration-500 group-hover:scale-125"
                                            style={{ background: `radial-gradient(circle, ${nft.accent}, transparent)` }}
                                        />
                                        <span
                                            className="absolute text-[10px] font-semibold tracking-[0.2em] uppercase"
                                            style={{ color: nft.accent, opacity: 0.4 }}
                                        >
                                            3D preview
                                        </span>
                                        <div
                                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                                            style={{ background: "rgba(0,0,0,0.6)" }}
                                        >
                                            <span className="text-[12px] font-semibold tracking-widest uppercase text-white/80">
                                                View NFT →
                                            </span>
                                        </div>
                                    </div>

                                    {/* Card body */}
                                    <div className="p-5">
                                        <p className="text-[11px] font-semibold text-white/25 mb-2 tracking-widest">
                                            {nft.num} /
                                        </p>
                                        <h3 className="text-[15px] font-bold text-white mb-3 leading-tight">{nft.name}</h3>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {nft.tags.map(t => (
                                                <span
                                                    key={t}
                                                    className="text-[10px] font-semibold tracking-widest uppercase"
                                                    style={{ color: "rgba(255,255,255,0.25)" }}
                                                >
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* ── Coming soon banner ── */}
                        <div
                            className="mt-20 p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
                            style={{ border: "1px solid rgba(255,255,255,0.08)", background: "#161b27" }}
                        >
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-6 h-px" style={{ background: "#b2ff00" }} />
                                    <span className="text-[11px] font-semibold tracking-[0.18em] text-white/35 uppercase">
                                        Coming soon
                                    </span>
                                </div>
                                <h2 className="text-[22px] font-black text-white mb-2 leading-tight">
                                    Public gallery launching Q2 2026
                                </h2>
                                <p className="text-[13px] text-white/40 leading-relaxed">
                                    Mint your NFT and it will appear here for the world to discover.
                                </p>
                            </div>
                            <a
                                href="/#studio"
                                className="flex-shrink-0 flex items-center gap-3 text-[12px] font-semibold tracking-widest uppercase text-white/60 hover:text-[#b2ff00] transition-colors"
                            >
                                Open Studio <span>→</span>
                            </a>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </LenisWrapper>
    );
}
