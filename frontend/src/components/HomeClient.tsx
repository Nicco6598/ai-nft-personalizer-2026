"use client";

import { useState, useCallback, lazy, Suspense } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import {
    Sparkles,
    Wallet,
    Loader2,
    ChevronRight,
    Github,
    Zap,
    Cpu,
    Box,
    Globe,
    Shield
} from "lucide-react";
import ImageUploader from "@/components/ImageUploader";

// Lazy-load the heavy Three.js canvas
const ModelViewer = lazy(() => import("@/components/ModelViewer"));

// ── Types ───────────────────────────────────────────────────────────────────
type GenerationStatus = "idle" | "loading" | "done" | "error";

interface NftMetadata {
    name: string;
    description: string;
    image: string;
    model_url: string;
    attributes: Array<{ trait_type: string; value: string }>;
}

// ── Component ────────────────────────────────────────────────────────────────
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
            const res = await fetch(`${apiUrl}/generate`, {
                method: "POST",
                body: form,
            });

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
        <div className="relative min-h-screen bg-[#050505] text-white selection:bg-cyan-500 selection:text-black font-sans">
            {/* ── Background Area ─────────────────────────────────────────── */}
            <div className="fixed inset-0 -z-10 bg-[linear-gradient(to_right,#14f1ff08_1px,transparent_1px),linear-gradient(to_bottom,#14f1ff08_1px,transparent_1px)] [background-size:40px_40px]" />
            <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_-20%,#14f1ff15,transparent_60%)]" />

            {/* ── Navigation ─────────────────────────────────────────────────── */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/90 backdrop-blur-xl border-b border-cyan-500/20 px-6 h-20">
                <div className="max-w-6xl mx-auto h-full flex items-center justify-between">
                    <div className="flex items-center gap-4 group cursor-pointer">
                        <div className="w-10 h-10 bg-cyan-500 flex items-center justify-center text-black shadow-[0_0_20px_rgba(20,241,255,0.4)] group-hover:scale-110 transition-transform">
                            <Zap size={22} fill="currentColor" />
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="font-black text-xl tracking-tighter uppercase">
                                NFT<span className="text-cyan-500">Personalizer</span>
                            </span>
                            <span className="text-[9px] font-bold text-cyan-500/50 tracking-[0.3em] mt-1">CORE_ENGINE_V2.0</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="hidden lg:flex items-center gap-8 mr-8">
                            {['Network', 'Terminal', 'Vault'].map(item => (
                                <button key={item} className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-cyan-400 transition-colors">
                                    {item}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => isConnected ? disconnect() : connect({ connector: injected() })}
                            className="h-10 px-6 bg-transparent text-cyan-500 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-cyan-500 hover:text-black transition-all border border-cyan-500"
                        >
                            {isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Connect_Wallet'}
                        </button>
                    </div>
                </div>
            </nav>

            {/* ── Hero Section ─────────────────────────────────────────────── */}
            <header className="pt-44 pb-24 px-6 text-center overflow-hidden">
                <div className="max-w-6xl mx-auto relative">
                    {/* Decorative Elements */}
                    <div className="absolute top-1/2 left-0 -translate-y-1/2 w-32 h-px bg-gradient-to-r from-transparent to-cyan-500/50 hidden xl:block" />
                    <div className="absolute top-1/2 right-0 -translate-y-1/2 w-32 h-px bg-gradient-to-l from-transparent to-cyan-500/50 hidden xl:block" />

                    <div className="inline-flex items-center gap-3 px-4 py-1.5 border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 text-[10px] font-black uppercase tracking-[0.3em] mb-10">
                        <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse" />
                        Neural Synthesis Protocol Active
                    </div>

                    <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.85] uppercase mb-8">
                        Build Your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-cyan-900">3D Legacy</span>
                    </h1>

                    <p className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto leading-tight font-medium uppercase tracking-tight mb-12">
                        Convert <span className="text-white">Image Data</span> into high-fidelity <span className="text-cyan-400">3D visual entities</span>.
                        Strict structural logic. Zero decorative compromise.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-0">
                        <button className="w-full sm:w-auto px-14 py-6 bg-cyan-500 text-black font-black uppercase tracking-[0.2em] text-xs hover:bg-white transition-all shadow-[0_0_30px_rgba(20,241,255,0.3)]">
                            Launch_Generator
                        </button>
                        <button className="w-full sm:w-auto px-14 py-6 bg-transparent text-white font-black uppercase tracking-[0.2em] text-xs border border-cyan-500/30 border-t-0 sm:border-t sm:border-l-0 hover:bg-cyan-500/10 transition-all">
                            Documentation
                        </button>
                    </div>
                </div>
            </header>

            {/* ── Main Workspace ─────────────────────────────────────────── */}
            <main className="max-w-6xl mx-auto px-6 pb-40">

                {/* Status Bar */}
                <div className="flex items-center justify-between border border-cyan-500/20 bg-[#0a0a0a] px-6 py-4 mb-10">
                    <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em]">
                        <span className="flex items-center gap-2 text-cyan-400">
                            <Cpu size={14} /> System: Online
                        </span>
                        <span className="hidden sm:flex items-center gap-2 text-white/30">
                            <Globe size={14} /> Node: EU-West
                        </span>
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
                        Sess: 0x{Math.floor(Math.random() * 10000)}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-cyan-500/20 border border-cyan-500/20">

                    {/* Left: Input Console */}
                    <div className="bg-[#0a0a0a] p-10 lg:p-14">
                        <div className="mb-12 pb-8 border-b border-cyan-500/20">
                            <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Console_Input</h2>
                            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mt-2">Feed raw image data to the engine</p>
                        </div>

                        <div className="space-y-12">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-cyan-500/50 mb-4">
                                    [01] SOURCE_UPLOAD
                                </label>
                                <ImageUploader onChange={setImage} />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-[0.4em] text-cyan-500/50 mb-4">
                                    [02] STYLE_PARAMETERS
                                </label>
                                <textarea
                                    value={stylePrompt}
                                    onChange={(e) => setStylePrompt(e.target.value)}
                                    placeholder="e.g. Cyberpunk armor, matte black finish, neon details..."
                                    className="w-full h-40 bg-black border border-cyan-500/30 p-6 text-cyan-400 font-bold placeholder-white/10 focus:outline-none focus:border-cyan-400 transition-all resize-none shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]"
                                />
                            </div>

                            <button
                                onClick={handleGenerate}
                                disabled={!canGenerate}
                                className={[
                                    "w-full py-6 font-black uppercase tracking-[0.2em] text-base transition-all flex items-center justify-center gap-4 border",
                                    canGenerate
                                        ? "bg-cyan-500 text-black border-cyan-500 hover:bg-white shadow-[0_0_25px_rgba(20,241,255,0.2)]"
                                        : "bg-black text-white/10 border-white/5 cursor-not-allowed"
                                ].join(" ")}
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 size={24} className="animate-spin" />
                                        Processing_Data...
                                    </>
                                ) : (
                                    <>
                                        Start_Generation
                                        <ChevronRight size={20} strokeWidth={4} />
                                    </>
                                )}
                            </button>
                        </div>

                        {errorMsg && (
                            <div className="mt-8 p-5 bg-red-950/20 text-red-500 font-black text-xs uppercase tracking-[0.2em] border border-red-500/50">
                                system_fail :: {errorMsg}
                            </div>
                        )}
                    </div>

                    {/* Right: Output Stream */}
                    <div className="bg-[#050505] flex flex-col">
                        <div className="flex-1 relative min-h-[500px] border-b border-cyan-500/20 bg-[#080808]">
                            <Suspense fallback={
                                <div className="absolute inset-0 flex items-center justify-center text-cyan-500/10 font-black text-[10px] uppercase tracking-[1em]">
                                    LIFECYCLE_BOOT...
                                </div>
                            }>
                                <ModelViewer modelUrl={modelUrl} />
                            </Suspense>

                            <div className="absolute top-8 left-8 border border-cyan-500/30 bg-black/80 backdrop-blur-md px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">
                                Preview_Output
                            </div>
                        </div>

                        <div className="p-10 lg:p-14 bg-[#0a0a0a]">
                            {metadata ? (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex items-center gap-8 mb-10 pb-8 border-b border-cyan-500/20">
                                        <div className="w-16 h-16 bg-cyan-500 text-black flex items-center justify-center text-3xl font-black shadow-[0_0_15px_rgba(20,241,255,0.3)]">
                                            {metadata.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3 className="text-4xl font-black uppercase tracking-tighter leading-none text-white">{metadata.name}</h3>
                                            <p className="text-cyan-500/40 mt-2 text-[10px] font-black uppercase tracking-[0.3em]">Hash_Sum: {metadata.model_url.slice(-12)}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-px bg-cyan-500/20 border border-cyan-500/20 mb-8">
                                        {metadata.attributes.map((attr) => (
                                            <div key={attr.trait_type} className="p-6 bg-[#050505]">
                                                <span className="block text-[9px] font-black uppercase tracking-[0.3em] text-cyan-500/30 mb-2">
                                                    {attr.trait_type}
                                                </span>
                                                <span className="text-sm font-black text-white uppercase tracking-tight">{attr.value}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <button className="w-full py-5 bg-transparent text-cyan-500 font-black uppercase tracking-[0.2em] text-[10px] hover:bg-cyan-500 hover:text-black transition-all border border-cyan-500 shadow-[0_0_15px_rgba(20,241,255,0.1)]">
                                        Mint_on_Chain
                                    </button>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center py-10">
                                    <div className="w-10 h-10 border border-white/5 flex items-center justify-center text-white/10 mb-6">
                                        <Box size={24} className="animate-pulse" />
                                    </div>
                                    <p className="text-white/20 font-black text-[10px] uppercase tracking-[0.4em]">
                                        Awaiting Data Signal...
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* ── Footer ─────────────────────────────────────────────────────── */}
            <footer className="bg-black py-24 px-6 text-white border-t border-cyan-500/10">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="flex flex-col items-center md:items-start gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-cyan-500" />
                            <span className="font-black text-xl uppercase tracking-tighter">NFTPersonalizer</span>
                        </div>
                        <p className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">© 2026 Protocol Foundation. Built by Antigravity.</p>
                    </div>

                    <div className="flex gap-12">
                        {['GitHub', 'Twitter', 'Terms'].map(f => (
                            <a key={f} href="#" className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-cyan-400 transition-colors">{f}</a>
                        ))}
                    </div>

                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-cyan-500/20">
                        <Shield size={14} /> Security_Protocol_V7
                    </div>
                </div>
            </footer>
        </div>
    );
}
