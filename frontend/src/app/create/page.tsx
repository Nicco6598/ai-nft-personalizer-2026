import Link from "next/link";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import LenisWrapper from "@/components/LenisWrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Create — NFTP",
    description: "Generate your own 3D NFT from any image with AI.",
};

const STEPS = [
    {
        num: "01",
        title: "Upload an image",
        desc: "Drop any photo, artwork, or graphic. Our AI understands shapes, textures, and colors.",
        accent: "#14f1ff",
    },
    {
        num: "02",
        title: "Choose a style",
        desc: "Add an optional prompt to guide the visual style — cyberpunk, organic, minimal, and more.",
        accent: "#b2ff00",
    },
    {
        num: "03",
        title: "Generate in 3D",
        desc: "Tripo AI converts your image into a detailed 3D model in seconds. No design skills needed.",
        accent: "#8b5cf6",
    },
    {
        num: "04",
        title: "Mint on-chain",
        desc: "Pin your asset to IPFS and mint it as an NFT on Sepolia or Base Sepolia — free.",
        accent: "#b2ff00",
    },
];

const TECH = ["Tripo AI", "Groq Llama 3.3", "Pinata IPFS", "Ethereum Sepolia", "Base Sepolia", "Supabase"];

export default function CreatePage() {
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
                                        How it works
                                    </span>
                                </div>
                                <h1
                                    className="font-black leading-[0.92] tracking-tight"
                                    style={{ fontSize: "clamp(4rem, 10vw, 9rem)" }}
                                >
                                    From image
                                    <br />
                                    <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "#b2ff00" }}>to NFT</span>
                                </h1>
                            </div>
                            <div className="md:max-w-xs md:text-right md:pb-3">
                                <p className="text-[14px] text-white/45 leading-relaxed mb-5">
                                    No crypto experience needed. Connect a wallet, upload an image,
                                    and NFTP handles generation, metadata, and minting — all in one place.
                                </p>
                                <Link
                                    href="/#studio"
                                    className="inline-flex items-center gap-2 text-[12px] font-semibold tracking-widest uppercase text-white/60 hover:text-[#b2ff00] transition-colors"
                                >
                                    Open Studio <span>→</span>
                                </Link>
                            </div>
                        </div>

                        {/* ── Steps ── */}
                        <div
                            className="grid grid-cols-1 md:grid-cols-2 gap-px mb-20"
                            style={{ border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.06)" }}
                        >
                            {STEPS.map(step => (
                                <div
                                    key={step.num}
                                    className="p-8 flex gap-6"
                                    style={{ background: "#0d1117" }}
                                >
                                    {/* Number */}
                                    <div
                                        className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-[11px] font-black"
                                        style={{
                                            border: `1px solid ${step.accent}40`,
                                            color: step.accent,
                                        }}
                                    >
                                        {step.num}
                                    </div>
                                    <div>
                                        <h3 className="text-[16px] font-bold text-white mb-2 leading-tight">{step.title}</h3>
                                        <p className="text-[13px] text-white/40 leading-relaxed">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* ── CTA banner ── */}
                        <div
                            className="p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-20"
                            style={{ border: "1px solid rgba(178,255,0,0.15)", background: "#161b27" }}
                        >
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-6 h-px" style={{ background: "#b2ff00" }} />
                                    <span className="text-[11px] font-semibold tracking-[0.18em] text-white/35 uppercase">Studio</span>
                                </div>
                                <h2 className="text-[22px] font-black text-white mb-2 leading-tight">
                                    Ready to mint your first NFT?
                                </h2>
                                <p className="text-[13px] text-white/40 leading-relaxed">
                                    Head to the studio, upload your image, and bring your collectible to life in minutes.
                                </p>
                            </div>
                            <Link
                                href="/#studio"
                                className="flex-shrink-0 px-7 py-3 text-[12px] font-bold tracking-widest uppercase transition-all hover:opacity-90"
                                style={{ background: "#b2ff00", color: "#000" }}
                            >
                                Open Studio →
                            </Link>
                        </div>

                        {/* ── Powered by ── */}
                        <div>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-6 h-px" style={{ background: "rgba(255,255,255,0.15)" }} />
                                <span className="text-[11px] font-semibold tracking-[0.18em] text-white/25 uppercase">
                                    Powered by
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {TECH.map(tech => (
                                    <span
                                        key={tech}
                                        className="px-4 py-2 text-[11px] font-semibold tracking-widest uppercase"
                                        style={{
                                            border: "1px solid rgba(255,255,255,0.08)",
                                            color: "rgba(255,255,255,0.30)",
                                        }}
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </LenisWrapper>
    );
}
