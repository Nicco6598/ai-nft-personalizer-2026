"use client";

import { useState, useCallback, lazy, Suspense } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import {
    Loader2,
    ArrowUpRight,
    Zap,
    Box,
    Sparkles,
    Wallet,
} from "lucide-react";
import ImageUploader from "@/components/ImageUploader";

const ModelViewer = lazy(() => import("@/components/ModelViewer"));

type GenerationStatus = "idle" | "loading" | "done" | "error";

interface NftMetadata {
    name: string;
    description: string;
    image: string;
    model_url: string;
    attributes: Array<{ trait_type: string; value: string }>;
}

export default function HomeClient() {
    const [image, setImage] = useState<File | null>(null);
    const [stylePrompt, setStylePrompt] = useState("");
    const [status, setStatus] = useState<GenerationStatus>("idle");
    const [modelUrl, setModelUrl] = useState<string | null>(null);
    const [metadata, setMetadata] = useState<NftMetadata | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const { address, isConnected } = useAccount();
    const { connect } = useConnect();
    const { disconnect } = useDisconnect();

    const handleGenerate = useCallback(async () => {
        if (!image || status === "loading") return;
        setStatus("loading");
        setErrorMsg(null);
        try {
            const form = new FormData();
            form.append("image", image);
            form.append("style_prompt", stylePrompt.trim());
            const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
            const res = await fetch(`${apiUrl}/generate`, { method: "POST", body: form });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err?.detail ?? "Backend error");
            }
            const data: { model_url: string; metadata: NftMetadata } = await res.json();
            setModelUrl(data.model_url);
            setMetadata(data.metadata);
            setStatus("done");
        } catch (err) {
            setErrorMsg(err instanceof Error ? err.message : "Unknown error");
            setStatus("error");
        }
    }, [image, stylePrompt, status]);

    const isGenerating = status === "loading";
    const canGenerate = !!image && !isGenerating;

    return (
        <div className="relative min-h-screen bg-[#0d1117] text-white font-sans overflow-x-hidden">

            {/* ── Ambient background glows ───────────────────────────── */}
            <div className="fixed inset-0 -z-10 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full bg-[#14f1ff] opacity-[0.04] blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-[600px] h-[400px] rounded-full bg-[#b2ff00] opacity-[0.03] blur-[100px]" />
            </div>

            {/* ── Navigation ─────────────────────────────────────────── */}
            <nav className="sticky top-0 z-50 px-8 py-5">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2 cursor-pointer">
                        <span className="font-black text-xl tracking-wider uppercase text-white" style={{ letterSpacing: '0.15em' }}>
                            NFT<span className="text-[#b2ff00]">P</span>
                        </span>
                    </div>

                    <div className="hidden md:flex items-center gap-10">
                        {['HOME', 'ABOUT', 'STUDIO', 'CONTACT'].map(item => (
                            <button key={item} className="text-[11px] font-bold tracking-[0.18em] text-white/50 hover:text-white transition-colors">
                                {item}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => isConnected ? disconnect() : connect({ connector: injected() })}
                        className="flex items-center gap-2 h-9 px-5 border border-white/15 text-white/70 text-[11px] font-bold tracking-[0.1em] uppercase rounded-full hover:border-[#b2ff00]/60 hover:text-[#b2ff00] transition-all"
                    >
                        <Wallet size={13} />
                        {isConnected ? `${address?.slice(0, 6)}…${address?.slice(-4)}` : 'Connect'}
                    </button>
                </div>
            </nav>

            {/* ── Hero ───────────────────────────────────────────────── */}
            <header className="relative flex flex-col justify-center px-8" style={{ minHeight: 'calc(100vh - 74px)' }}>

                {/* Glow orb centrato */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#14f1ff]/12 via-[#b2ff00]/5 to-transparent blur-[110px]" />
                    <div className="absolute w-[440px] h-[440px] rounded-full border border-[#14f1ff]/8" />
                    <div className="absolute w-[290px] h-[290px] rounded-full border border-[#b2ff00]/8" />
                    <Zap size={64} className="absolute text-[#14f1ff]/12" strokeWidth={0.7} />
                </div>

                {/* Testo hero — allineato a sinistra, centrato verticalmente */}
                <div className="max-w-7xl mx-auto w-full relative z-10 pb-20">
                    <p className="text-sm font-medium text-white/40 mb-5 tracking-wider">The future is now</p>
                    <h1 className="text-[clamp(3.5rem,9vw,7.5rem)] font-black uppercase leading-[0.88] tracking-tight mb-10">
                        <span className="text-white block">CREATE YOUR</span>
                        <span className="text-[#b2ff00] block">3D NFT</span>
                    </h1>

                    <div className="flex items-center gap-5">
                        <button className="flex items-center gap-3 bg-white text-black font-bold text-sm px-7 py-3.5 rounded-full hover:bg-[#b2ff00] transition-colors group">
                            Discover
                            <span className="w-7 h-7 bg-[#0d1117] rounded-full flex items-center justify-center group-hover:bg-black transition-colors flex-shrink-0">
                                <ArrowUpRight size={14} className="text-white" />
                            </span>
                        </button>
                        <button className="text-[#b2ff00] font-bold text-sm tracking-wide hover:text-white transition-colors">
                            Connect →
                        </button>
                    </div>
                </div>
            </header>

            {/* ── Feature cards row — bottom of hero like reference ─── */}
            <section className="px-8 pb-10 -mt-2">
                <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        {
                            label: "Image to 3D",
                            desc: "Upload any image and transform it into a high-fidelity 3D asset powered by AI.",
                            color: "#14f1ff"
                        },
                        {
                            label: "Style Engine",
                            desc: "Describe your style — cyberpunk, organic, abstract — and the engine interprets it.",
                            color: "#8b5cf6"
                        },
                        {
                            label: "Generative NFT",
                            desc: "AI-driven creativity for unique on-chain digital collectibles, ready to mint.",
                            color: "#f97316"
                        },
                    ].map((card, i) => (
                        <div key={i} className="bg-[#161b27]/80 backdrop-blur-sm border border-white/6 rounded-2xl p-5 group hover:border-white/15 transition-all">
                            {/* Top row: thumbnail + arrow */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl flex-shrink-0" style={{ background: `linear-gradient(135deg, ${card.color}35, ${card.color}12)` }} />
                                <div className="w-7 h-7 bg-white/6 rounded-full flex items-center justify-center text-white/30 group-hover:bg-[#b2ff00]/20 group-hover:text-[#b2ff00] transition-all flex-shrink-0">
                                    <ArrowUpRight size={13} />
                                </div>
                            </div>
                            {/* Text below */}
                            <p className="text-[11px] font-semibold text-white/70 mb-1">{card.label}</p>
                            <p className="text-[11px] text-white/35 leading-relaxed">{card.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Studio / Generator ─────────────────────────────────── */}
            <main className="px-8 pb-32 pt-16">
                <div className="max-w-7xl mx-auto">

                    {/* Section header */}
                    <div className="mb-10">
                        <span className="text-[11px] font-bold tracking-[0.25em] text-[#b2ff00] uppercase">Studio</span>
                        <h2 className="text-4xl font-black uppercase tracking-tight mt-2 leading-tight">
                            Generate Your<br />
                            <span className="text-white/25">3D Asset</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                        {/* Input panel */}
                        <div className="bg-[#161b27] border border-white/6 rounded-2xl p-8">
                            <div className="mb-8">
                                <h3 className="text-lg font-bold text-white">Input Console</h3>
                                <p className="text-xs text-white/35 mt-1 tracking-wide">Feed your image into the engine</p>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-[0.25em] text-white/30 mb-3">
                                        01 — Source Image
                                    </label>
                                    <ImageUploader onChange={setImage} />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-[0.25em] text-white/30 mb-3">
                                        02 — Style Parameters
                                    </label>
                                    <textarea
                                        value={stylePrompt}
                                        onChange={(e) => setStylePrompt(e.target.value)}
                                        placeholder="e.g. Cyberpunk armor, neon details, matte black finish…"
                                        className="w-full h-28 bg-[#0d1117] border border-white/8 rounded-xl p-4 text-sm text-white/80 placeholder-white/15 focus:outline-none focus:border-[#b2ff00]/40 transition-all resize-none"
                                    />
                                </div>

                                <button
                                    onClick={handleGenerate}
                                    disabled={!canGenerate}
                                    className={[
                                        "w-full py-4 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-3",
                                        canGenerate
                                            ? "bg-[#b2ff00] text-black hover:bg-white"
                                            : "bg-white/5 text-white/20 cursor-not-allowed"
                                    ].join(" ")}
                                >
                                    {isGenerating ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            Processing…
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles size={17} />
                                            Generate 3D NFT
                                        </>
                                    )}
                                </button>
                            </div>

                            {errorMsg && (
                                <div className="mt-5 p-4 bg-red-500/10 text-red-400 text-xs font-medium rounded-xl border border-red-500/20">
                                    {errorMsg}
                                </div>
                            )}
                        </div>

                        {/* Output panel */}
                        <div className="bg-[#161b27] border border-white/6 rounded-2xl flex flex-col overflow-hidden">
                            {/* 3D viewer — altezza fissa per garantire rendering WebGL */}
                            <div className="relative h-[360px] bg-[#0d1117] rounded-t-2xl overflow-hidden">
                                <Suspense fallback={
                                    <div className="absolute inset-0 flex items-center justify-center text-white/15 text-xs font-medium tracking-widest uppercase">
                                        Loading…
                                    </div>
                                }>
                                    <ModelViewer modelUrl={modelUrl} />
                                </Suspense>
                                <div className="absolute top-4 left-4 bg-white/5 backdrop-blur-sm border border-white/8 rounded-full px-3 py-1 text-[10px] font-bold text-white/35 tracking-wider uppercase">
                                    Preview
                                </div>
                            </div>

                            {/* NFT Info */}
                            <div className="p-8">
                                {metadata ? (
                                    <div className="animate-in fade-in slide-in-from-bottom-3 duration-400">

                                        {/* Name + description */}
                                        <div className="mb-5">
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-9 h-9 bg-[#b2ff00] rounded-lg text-black flex items-center justify-center text-base font-black flex-shrink-0">
                                                    {metadata.name.charAt(0)}
                                                </div>
                                                <h3 className="font-bold text-white text-base leading-tight">{metadata.name}</h3>
                                            </div>
                                            {metadata.description && (
                                                <p className="text-xs text-white/45 leading-relaxed mt-2 border-l-2 border-[#b2ff00]/30 pl-3">
                                                    {metadata.description}
                                                </p>
                                            )}
                                        </div>

                                        {/* Traits */}
                                        {metadata.attributes.length > 0 && (
                                            <div className="mb-5">
                                                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/25 mb-3">NFT Traits</p>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {metadata.attributes.map((attr) => (
                                                        <div key={attr.trait_type} className="p-3 bg-[#0d1117] rounded-xl border border-white/5">
                                                            <span className="block text-[10px] text-white/35 mb-0.5 capitalize">
                                                                {attr.trait_type.replace(/_/g, ' ')}
                                                            </span>
                                                            <span className="text-sm font-semibold text-white capitalize">{attr.value}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <button className="w-full py-3.5 bg-[#b2ff00] text-black font-bold text-sm rounded-xl hover:bg-white transition-colors flex items-center justify-center gap-2">
                                            <Zap size={16} fill="currentColor" />
                                            Mint on Chain
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-center py-8">
                                        <div className="w-12 h-12 bg-white/4 rounded-xl flex items-center justify-center mb-4 border border-white/6">
                                            <Box size={22} className="text-white/15" />
                                        </div>
                                        <p className="text-sm text-white/20 font-medium">Your 3D NFT will appear here</p>
                                        <p className="text-xs text-white/10 mt-1">Upload an image and hit Generate</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* ── Footer ──────────────────────────────────────────────── */}
            <footer className="border-t border-white/6 py-10 px-8">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-5">
                    <span className="font-black text-lg tracking-[0.15em] uppercase">
                        NFT<span className="text-[#b2ff00]">P</span>
                        <span className="text-white/20 font-normal text-sm ml-3">© 2026</span>
                    </span>

                    <div className="flex gap-8">
                        {['GitHub', 'Twitter', 'Terms'].map(f => (
                            <a key={f} href="#" className="text-xs text-white/25 hover:text-white transition-colors font-medium">{f}</a>
                        ))}
                    </div>

                    <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/15">
                        Built with AI · 2026
                    </div>
                </div>
            </footer>
        </div>
    );
}
