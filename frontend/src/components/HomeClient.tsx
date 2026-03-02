"use client";

import { useState, useCallback, lazy, Suspense, useEffect, useRef } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import {
    CircleNotchIcon,
    LightningIcon,
    CubeIcon,
    MagicWandIcon,
    CopySimpleIcon,
    DownloadSimpleIcon,
    CheckIcon,
    ScanIcon,
    CubeTransparentIcon,
    SparkleIcon,
    FlagIcon,
} from "@phosphor-icons/react";
import ImageUploader from "@/components/ImageUploader";
import HistoryDrawer from "@/components/HistoryDrawer";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/components/ToastProvider";

const ModelViewer = lazy(() => import("@/components/ModelViewer"));

const TRAIT_COLORS: Record<string, { border: string; label: string; dot: string }> = {
    Mood:       { border: "#8b5cf6", label: "#a78bfa", dot: "#8b5cf6" },
    Palette:    { border: "#f97316", label: "#fb923c", dot: "#f97316" },
    Texture:    { border: "#14f1ff", label: "#67e8f9", dot: "#14f1ff" },
    Atmosphere: { border: "#10b981", label: "#34d399", dot: "#10b981" },
    Era:        { border: "#f59e0b", label: "#fbbf24", dot: "#f59e0b" },
    Element:    { border: "#ef4444", label: "#f87171", dot: "#ef4444" },
    Form:       { border: "#3b82f6", label: "#60a5fa", dot: "#3b82f6" },
    Rarity:     { border: "#b2ff00", label: "#b2ff00", dot: "#b2ff00" },
    Theme:      { border: "#ec4899", label: "#f472b6", dot: "#ec4899" },
    Finish:     { border: "#6366f1", label: "#818cf8", dot: "#6366f1" },
};

// Steps 0-2 are the 3 "mini" steps shown as small dots at the top.
// Step 3 = final step active (FlagIcon), step 4 = allDone (GSAP fires).
const MINI_STEPS = [
    { label: "Analyzing image",   icon: ScanIcon },
    { label: "Generating 3D",     icon: CubeTransparentIcon },
    { label: "Creating metadata", icon: SparkleIcon },
];
const FINAL_STEP = { label: "Finalizing NFT", icon: FlagIcon };

// All step labels in order (for the hero area during loading)
const ALL_STEP_LABELS = [
    ...MINI_STEPS.map(s => s.label),
    FINAL_STEP.label,
];

function GenerationProgress({ step }: { step: number }) {
    const allDone     = step >= 4;
    const finalActive = step === 3 && !allDone;

    const bigCircleRef = useRef<HTMLDivElement>(null);
    const bigCheckRef  = useRef<HTMLDivElement>(null);
    const bigTextRef   = useRef<HTMLDivElement>(null);
    const ringsRef     = useRef<HTMLDivElement>(null);
    const prevDone     = useRef(false);

    // GSAP: fire once when allDone flips true
    useEffect(() => {
        if (!allDone || prevDone.current) return;
        prevDone.current = true;

        (async () => {
            const { gsap } = await import("gsap");

            gsap.fromTo(bigCircleRef.current,
                { scale: 0.6, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.55, ease: "back.out(2.5)", delay: 0.05 }
            );

            if (ringsRef.current) {
                gsap.fromTo(Array.from(ringsRef.current.children),
                    { scale: 1, opacity: 0.5 },
                    { scale: 2.6, opacity: 0, duration: 1.0, stagger: 0.16, ease: "power2.out", delay: 0.2 }
                );
            }

            gsap.fromTo(bigCheckRef.current,
                { scale: 0, rotate: -30 },
                { scale: 1, rotate: 0, duration: 0.4, ease: "back.out(3.5)", delay: 0.3 }
            );

            gsap.fromTo(bigTextRef.current,
                { y: 10, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.45, ease: "power3.out", delay: 0.5 }
            );
        })();
    }, [allDone]);

    useEffect(() => {
        if (step === 0) prevDone.current = false;
    }, [step]);

    // The label shown below the big circle during loading (steps 0-3)
    const activeLabel = ALL_STEP_LABELS[Math.min(step, 3)];

    // Which mini-step icon to show in the big circle during loading
    const ActiveHeroIcon = step < MINI_STEPS.length ? MINI_STEPS[step].icon : FINAL_STEP.icon;

    return (
        <div style={{ padding: "16px 0 6px", overflow: "visible" }}>

            {/* ── Mini steps row: 3 dots centered, middle dot aligns with hero circle ── */}
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                {/* Fixed width so middle dot is exactly at center (= above hero circle) */}
                <div style={{ display: "flex", alignItems: "center", width: 196 }}>
                    {MINI_STEPS.map((s, i) => {
                        const done   = allDone || i < step;
                        const active = !allDone && i === step;
                        const Icon   = s.icon;
                        return (
                            <div key={i} style={{ display: "contents" }}>
                                {/* Connector line before every dot except the first */}
                                {i > 0 && (
                                    <div style={{
                                        flex: 1, height: 1, minWidth: 0,
                                        background: (allDone || i <= step) ? "rgba(178,255,0,0.4)" : "rgba(255,255,255,0.07)",
                                        transition: "background 0.5s ease",
                                    }} />
                                )}
                                {/* Dot */}
                                <div style={{
                                    flexShrink: 0, width: 24, height: 24, borderRadius: "50%",
                                    background: done
                                        ? "rgba(178,255,0,0.13)"
                                        : active ? "rgba(20,241,255,0.11)" : "rgba(255,255,255,0.03)",
                                    border: `1.5px solid ${done ? "rgba(178,255,0,0.45)" : active ? "rgba(20,241,255,0.4)" : "rgba(255,255,255,0.09)"}`,
                                    boxShadow: active ? "0 0 10px rgba(20,241,255,0.28)" : done ? "0 0 8px rgba(178,255,0,0.15)" : "none",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    transition: "all 0.4s ease",
                                }}>
                                    {done
                                        ? <CheckIcon size={11} weight="bold" style={{ color: "#b2ff00" }} />
                                        : <Icon size={11} weight={active ? "fill" : "light"}
                                            style={{ color: active ? "#14f1ff" : "rgba(255,255,255,0.2)" }}
                                            className={active ? "animate-pulse" : ""} />
                                    }
                                </div>
                                {/* Connector line after every dot except the last */}
                                {i < MINI_STEPS.length - 1 && (
                                    <div style={{
                                        flex: 1, height: 1, minWidth: 0,
                                        background: done ? "rgba(178,255,0,0.4)" : "rgba(255,255,255,0.07)",
                                        transition: "background 0.5s ease",
                                    }} />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* ── Hero area: big circle + label (always visible while loading or done) ── */}
            <div style={{
                position: "relative",
                display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center",
                minHeight: 110,
                overflow: "visible",
            }}>
                {/* Expanding rings (allDone only, behind the circle) */}
                <div ref={ringsRef} style={{
                    position: "absolute", top: "40px", left: "50%",
                    transform: "translateX(-50%)",
                    pointerEvents: "none", zIndex: 0,
                    width: 60, height: 60,
                    display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                    {[0, 1, 2].map(i => (
                        <div key={i} style={{
                            position: "absolute",
                            width: 60, height: 60, borderRadius: "50%",
                            border: "1.5px solid rgba(178,255,0,0.45)",
                            opacity: 0,
                        }} />
                    ))}
                </div>

                {/* Big circle */}
                <div ref={bigCircleRef} style={{
                    position: "relative", zIndex: 1,
                    width: allDone ? 60 : 52,
                    height: allDone ? 60 : 52,
                    borderRadius: "50%",
                    background: allDone
                        ? "rgba(178,255,0,0.13)"
                        : finalActive ? "rgba(20,241,255,0.11)" : "rgba(255,255,255,0.05)",
                    border: `1.5px solid ${allDone ? "rgba(178,255,0,0.55)" : finalActive ? "rgba(20,241,255,0.45)" : "rgba(255,255,255,0.12)"}`,
                    boxShadow: allDone
                        ? "0 0 32px rgba(178,255,0,0.25)"
                        : finalActive ? "0 0 18px rgba(20,241,255,0.22)" : "none",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    transition: "width 0.35s ease, height 0.35s ease, background 0.35s, border-color 0.35s, box-shadow 0.45s",
                }}>
                    <div ref={bigCheckRef} style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {allDone
                            ? <CheckIcon size={24} weight="bold" style={{ color: "#b2ff00" }} />
                            : <ActiveHeroIcon
                                size={finalActive ? 22 : 20}
                                weight={finalActive || step > 0 ? "fill" : "light"}
                                style={{ color: finalActive ? "#14f1ff" : step > 0 ? "#14f1ff" : "rgba(255,255,255,0.3)" }}
                                className={(finalActive || (!allDone && step >= 0)) ? "animate-pulse" : ""}
                              />
                        }
                    </div>
                </div>

                {/* Label below big circle — always visible during loading/done */}
                <div ref={bigTextRef} style={{ textAlign: "center", marginTop: 14, zIndex: 1 }}>
                    {allDone ? (
                        <>
                            <p style={{ fontSize: 15, fontWeight: 700, color: "#b2ff00", letterSpacing: "-0.01em" }}>
                                NFT ready
                            </p>
                            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>
                                All steps completed
                            </p>
                        </>
                    ) : (
                        <>
                            <p style={{ fontSize: 13, fontWeight: 600, color: "#14f1ff", letterSpacing: "-0.005em" }}>
                                {activeLabel}
                                <span className="animate-pulse" style={{ color: "rgba(20,241,255,0.5)" }}>…</span>
                            </p>
                            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", marginTop: 3 }}>
                                Step {Math.min(step + 1, 4)} of 4
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function HomeClient() {
    const [image, setImage] = useState<File | null>(null);
    const [stylePrompt, setStylePrompt] = useState("");
    const [historyOpen, setHistoryOpen] = useState(false);

    const {
        status, modelUrl, metadata, errorMsg, progressStep,
        setStatus, setModelUrl, setMetadata, setErrorMsg, setProgressStep,
        addToHistory, history,
    } = useAppStore();

    const toast = useToast();

    const { address, isConnected } = useAccount();
    const { connect } = useConnect();
    const { disconnect } = useDisconnect();

    const generateBtnRef = useRef<HTMLButtonElement>(null);
    const traitsRef = useRef<HTMLDivElement>(null);
    const stepTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

    // ── Lenis smooth scroll ──────────────────────────────────
    useEffect(() => {
        let rafId: number;

        const initLenis = async () => {
            const { default: Lenis } = await import("lenis");
            const lenis = new Lenis({ lerp: 0.08, smoothWheel: true });

            const raf = (time: number) => {
                lenis.raf(time);
                rafId = requestAnimationFrame(raf);
            };
            rafId = requestAnimationFrame(raf);

            return lenis;
        };

        const lenisPromise = initLenis();
        return () => {
            cancelAnimationFrame(rafId);
            lenisPromise.then(l => l.destroy());
        };
    }, []);

    // ── GSAP entrance animations ─────────────────────────────
    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let ctx: any;

        const initGsap = async () => {
            const { gsap } = await import("gsap");
            const { ScrollTrigger } = await import("gsap/ScrollTrigger");
            gsap.registerPlugin(ScrollTrigger);

            ctx = gsap.context(() => {
                gsap.fromTo(".hero-line",
                    { opacity: 0, y: 40 },
                    { opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: "power3.out", delay: 0.1 }
                );

                gsap.fromTo(".feature-card",
                    { opacity: 0, y: 32 },
                    {
                        opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "power2.out",
                        scrollTrigger: { trigger: ".feature-cards", start: "top 85%" }
                    }
                );

                gsap.fromTo(".studio-header",
                    { opacity: 0, y: 24 },
                    {
                        opacity: 1, y: 0, duration: 0.7, ease: "power2.out",
                        scrollTrigger: { trigger: ".studio-header", start: "top 88%" }
                    }
                );

                gsap.fromTo(".panel-input",
                    { opacity: 0, y: 36 },
                    {
                        opacity: 1, y: 0, duration: 0.8, ease: "power2.out",
                        scrollTrigger: { trigger: ".panel-input", start: "top 88%" }
                    }
                );

                gsap.fromTo(".panel-output",
                    { opacity: 0, y: 36 },
                    {
                        opacity: 1, y: 0, duration: 0.8, delay: 0.1, ease: "power2.out",
                        scrollTrigger: { trigger: ".panel-output", start: "top 88%" }
                    }
                );
            });
        };

        initGsap();
        return () => ctx?.revert();
    }, []);

    // ── Magnetic generate button (desktop only) ──────────────
    useEffect(() => {
        const btn = generateBtnRef.current;
        // Skip on touch devices to avoid stuck transforms on mobile
        if (!btn || window.matchMedia("(hover: none)").matches) return;

        let xTo: ((v: number) => void) | null = null;
        let yTo: ((v: number) => void) | null = null;

        const initMagnetic = async () => {
            const { gsap } = await import("gsap");
            xTo = gsap.quickTo(btn, "x", { duration: 0.4, ease: "power3.out" });
            yTo = gsap.quickTo(btn, "y", { duration: 0.4, ease: "power3.out" });
        };

        initMagnetic();

        const onMove = (e: MouseEvent) => {
            if (!xTo || !yTo) return;
            const rect = btn.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = e.clientX - cx;
            const dy = e.clientY - cy;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 80) {
                xTo(dx * 0.35);
                yTo(dy * 0.35);
            }
        };

        const onLeave = async () => {
            const { gsap } = await import("gsap");
            gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1,0.5)" });
        };

        btn.addEventListener("mousemove", onMove);
        btn.addEventListener("mouseleave", onLeave);
        return () => {
            btn.removeEventListener("mousemove", onMove);
            btn.removeEventListener("mouseleave", onLeave);
        };
    }, []);

    // Reset magnetic transform when button state changes (prevents stuck position on mobile)
    useEffect(() => {
        const btn = generateBtnRef.current;
        if (!btn) return;
        (async () => {
            const { gsap } = await import("gsap");
            gsap.set(btn, { x: 0, y: 0 });
        })();
    }, [status]);

    // ── Trait cards: 3D tilt + staggered entrance ────────────
    useEffect(() => {
        const container = traitsRef.current;
        if (!container || !metadata) return;

        let gsapRef: typeof import("gsap").gsap | null = null;

        const init = async () => {
            const { gsap } = await import("gsap");
            gsapRef = gsap;

            const cards = Array.from(container.querySelectorAll<HTMLElement>(".trait-card"));

            // Staggered entrance
            gsap.fromTo(cards,
                { opacity: 0, y: 12, scale: 0.95 },
                { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.05, ease: "power2.out" }
            );

            // 3D tilt per card
            cards.forEach(card => {
                const move = (e: MouseEvent) => {
                    if (!gsapRef) return;
                    const rect = card.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
                    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
                    gsapRef.to(card, {
                        rotateY: x * 8, rotateX: -y * 8,
                        transformPerspective: 600,
                        duration: 0.3, ease: "power2.out",
                    });
                };

                const leave = () => {
                    if (!gsapRef) return;
                    gsapRef.to(card, {
                        rotateY: 0, rotateX: 0,
                        duration: 0.5, ease: "elastic.out(1,0.5)",
                    });
                };

                card.addEventListener("mousemove", move);
                card.addEventListener("mouseleave", leave);

                // Cleanup attached to the card element itself
                (card as HTMLElement & { _cleanupTilt?: () => void })._cleanupTilt = () => {
                    card.removeEventListener("mousemove", move);
                    card.removeEventListener("mouseleave", leave);
                };
            });
        };

        init();

        return () => {
            const cards = Array.from(container.querySelectorAll<HTMLElement & { _cleanupTilt?: () => void }>(".trait-card"));
            cards.forEach(card => card._cleanupTilt?.());
        };
    }, [metadata]);

    const handleGenerate = useCallback(async () => {
        if (!image || status === "loading") return;

        setStatus("loading");
        setErrorMsg(null);
        setProgressStep(0);

        // Clear existing timers
        stepTimersRef.current.forEach(clearTimeout);
        stepTimersRef.current = [];

        // Simulate progress steps with known timings (steps 1, 2, 3 — step 4 fires on API response)
        const STEP_TIMINGS = [1500, 3500, 5200]; // ms for steps 1, 2, 3
        const stepDelay = (ms: number) => new Promise<void>(res => {
            stepTimersRef.current.push(setTimeout(res, ms));
        });

        // Kick off progress animation and API call in parallel
        const progressSequence = (async () => {
            await stepDelay(STEP_TIMINGS[0]);
            setProgressStep(1);
            await stepDelay(STEP_TIMINGS[1] - STEP_TIMINGS[0]);
            setProgressStep(2);
            await stepDelay(STEP_TIMINGS[2] - STEP_TIMINGS[1]);
            setProgressStep(3);
            // step 4 (all done = progressStep === 4) is set after API responds
        })();

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

            const data: { model_url: string; metadata: import("@/lib/store").NftMetadata } = await res.json();

            // Wait for progress animation to reach step 3 before revealing result
            await progressSequence;
            // Step 4 = all circles green, triggers final state
            setProgressStep(4);

            setModelUrl(data.model_url);
            setMetadata(data.metadata);
            setStatus("done");
            toast.success("NFT generated successfully!");

            // Save to history
            const imageDataUrl = URL.createObjectURL(image);
            addToHistory({
                metadata: data.metadata,
                modelUrl: data.model_url,
                imageDataUrl,
            });
        } catch (err) {
            // Cancel pending progress timers on error
            stepTimersRef.current.forEach(clearTimeout);
            stepTimersRef.current = [];
            const msg = err instanceof Error ? err.message : "Unknown error";
            setErrorMsg(msg);
            setStatus("error");
            toast.error(msg);
        }
    }, [image, stylePrompt, status, setStatus, setErrorMsg, setProgressStep, setModelUrl, setMetadata, toast, addToHistory]);

    const handleCopyMetadata = useCallback(async () => {
        if (!metadata) return;
        await navigator.clipboard.writeText(JSON.stringify(metadata, null, 2));
        toast.info("Copied to clipboard");
    }, [metadata, toast]);

    const handleDownloadMetadata = useCallback(() => {
        if (!metadata) return;
        const blob = new Blob([JSON.stringify(metadata, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${metadata.name.replace(/\s+/g, "-").toLowerCase()}-metadata.json`;
        a.click();
        URL.revokeObjectURL(url);
        toast.info("File downloaded");
    }, [metadata, toast]);

    // Cleanup step timers on unmount
    useEffect(() => {
        return () => stepTimersRef.current.forEach(clearTimeout);
    }, []);

    const isGenerating = status === "loading";
    const canGenerate = !!image && !isGenerating;

    return (
        <div className="relative min-h-screen bg-[#080b10] text-white overflow-x-hidden"
            style={{ fontFamily: "var(--font-sans)" }}>

            {/* ── Ambient glows ── */}
            <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
                <div className="absolute -top-48 -left-24 w-[600px] h-[600px] rounded-full opacity-60"
                    style={{ background: "radial-gradient(circle, rgba(20,241,255,0.05) 0%, transparent 65%)" }} />
                <div className="absolute top-1/2 -right-32 w-[500px] h-[500px] rounded-full opacity-60"
                    style={{ background: "radial-gradient(circle, rgba(178,255,0,0.04) 0%, transparent 65%)" }} />
            </div>

            {/* ── Nav ── */}
            <NavBar
                onHistoryClick={() => setHistoryOpen(true)}
                isConnected={isConnected}
                address={address}
                onWalletClick={() => isConnected ? disconnect() : connect({ connector: injected() })}
                historyCount={history.length}
            />

            {/* ── Hero ── */}
            <header className="px-6 md:px-10 pt-36 pb-28">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10">

                        {/* Left — eyebrow + giant H1 */}
                        <div>
                            <div className="hero-line flex items-center gap-3 mb-8">
                                <div className="w-8 h-px" style={{ background: "#b2ff00" }} />
                                <span className="text-[11px] font-semibold tracking-[0.18em] text-white/40 uppercase">
                                    Generative 3D collectibles
                                </span>
                            </div>
                            <h1 className="hero-line font-black leading-[0.92] tracking-tight"
                                style={{ fontSize: "clamp(4rem, 10vw, 9rem)" }}>
                                Turn any image
                                <br />
                                <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "#b2ff00" }}>
                                    into a 3D NFT.
                                </span>
                            </h1>
                        </div>

                        {/* Right — description + CTAs */}
                        <div className="hero-line md:max-w-xs md:text-right md:pb-3">
                            <p className="text-[14px] text-white/45 leading-relaxed mb-6">
                                Upload a face, a landscape, an object — anything. The pipeline generates a 3D model with AI-crafted metadata, ready to mint on-chain.
                            </p>
                            <div className="flex items-center gap-4 md:justify-end">
                                <a href="#studio"
                                    className="px-6 py-2.5 text-[12px] font-bold tracking-widest uppercase transition-all hover:opacity-90"
                                    style={{ background: "#b2ff00", color: "#000" }}>
                                    Start creating
                                </a>
                                <a href="#studio"
                                    className="text-[12px] font-semibold tracking-widest uppercase text-white/35 hover:text-[#b2ff00] transition-colors">
                                    How it works →
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* ── Feature cards ── */}
            <section className="px-6 md:px-10 pb-24">
                <div className="max-w-6xl mx-auto">
                    <div className="feature-cards grid grid-cols-1 sm:grid-cols-3 gap-px"
                        style={{ border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.06)" }}>
                        {[
                            {
                                num: "01",
                                label: "Image to 3D",
                                desc: "Upload any image and transform it into a high-fidelity 3D asset with Tripo AI.",
                                color: "#14f1ff",
                            },
                            {
                                num: "02",
                                label: "Style Engine",
                                desc: "Describe your vision — cyberpunk, organic, abstract — and the AI interprets it.",
                                color: "#b2ff00",
                            },
                            {
                                num: "03",
                                label: "Mint On-Chain",
                                desc: "AI-crafted metadata compatible with OpenSea, Blur and any ERC-721 marketplace.",
                                color: "#8b5cf6",
                            },
                        ].map((card, i) => (
                            <div key={i} className="feature-card p-8 cursor-default"
                                style={{ background: "#0d1117" }}>
                                <p className="text-[11px] font-semibold mb-5 tracking-widest"
                                    style={{ color: card.color }}>{card.num} /</p>
                                <p className="text-[16px] font-bold text-white mb-3 leading-tight">{card.label}</p>
                                <p className="text-[12px] text-white/35 leading-relaxed">{card.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Studio ── */}
            <main id="studio" className="px-6 md:px-10 pb-32">
                <div className="max-w-6xl mx-auto">

                    <div className="studio-header mb-12">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-px" style={{ background: "#b2ff00" }} />
                            <span className="text-[11px] font-semibold tracking-[0.18em] text-white/40 uppercase">Studio</span>
                        </div>
                        <h2 className="font-black text-white tracking-tight leading-[0.92]"
                            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}>
                            Generate your
                            <br />
                            <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "#b2ff00" }}>
                                3D asset
                            </span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-px"
                        style={{ border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.07)" }}>

                        {/* ── Input panel ── */}
                        <div className="panel-input" style={{ background: "#0d1117" }}>
                            <div className="px-7 pt-7 pb-0 mb-6">
                                <div className="flex items-baseline gap-3">
                                    <span className="text-[11px] font-semibold text-white/20">01 /</span>
                                    <p className="text-[15px] font-bold text-white">Source</p>
                                </div>
                                <p className="text-[12px] text-white/30 mt-1 pl-10">Upload your image to get started</p>
                            </div>
                            <div className="px-7 pb-7 space-y-5">
                                <div>
                                    <label className="block text-[11px] font-semibold text-white/25 mb-2.5 tracking-widest uppercase">
                                        Image
                                    </label>
                                    <ImageUploader onChange={setImage} />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold text-white/25 mb-2.5 tracking-widest uppercase">
                                        Style prompt <span className="text-white/15 font-normal normal-case">(optional)</span>
                                    </label>
                                    <textarea
                                        value={stylePrompt}
                                        onChange={(e) => setStylePrompt(e.target.value)}
                                        placeholder="e.g. Cyberpunk armor, neon details, matte finish…"
                                        rows={3}
                                        className="w-full px-4 py-3 text-[13px] text-white/70 placeholder-white/15 focus:outline-none resize-none transition-all"
                                        style={{
                                            background: "rgba(255,255,255,0.03)",
                                            border: "1px solid rgba(255,255,255,0.07)",
                                        }}
                                        onFocus={e => { e.target.style.borderColor = "rgba(178,255,0,0.25)"; }}
                                        onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.07)"; }}
                                    />
                                </div>

                                <button
                                    ref={generateBtnRef}
                                    onClick={handleGenerate}
                                    disabled={!canGenerate}
                                    className="w-full py-3.5 font-bold text-[12px] tracking-widest uppercase flex items-center justify-center gap-2 transition-all"
                                    style={canGenerate
                                        ? { background: "#b2ff00", color: "#000", cursor: "pointer" }
                                        : { background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.2)", cursor: "not-allowed", border: "1px solid rgba(255,255,255,0.06)" }}
                                >
                                    {isGenerating
                                        ? <><CircleNotchIcon size={15} weight="bold" className="animate-spin" />Processing…</>
                                        : <><MagicWandIcon size={14} weight="fill" />Generate 3D NFT</>
                                    }
                                </button>

                                {/* Progress steps — visible during and after generation */}
                                {(isGenerating || status === "done") && (
                                    <GenerationProgress step={progressStep} />
                                )}

                                {errorMsg && !isGenerating && (
                                    <p className="text-[11px] font-medium text-red-400 flex items-center gap-1.5">
                                        <span className="w-1 h-1 rounded-full bg-red-400 flex-shrink-0" />
                                        {errorMsg}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* ── Output panel ── */}
                        <div className="panel-output flex flex-col" style={{ background: "#0d1117" }}>

                            {/* Viewer */}
                            <div className="relative h-[320px] overflow-hidden"
                                style={{ background: "#060910" }}>
                                <Suspense fallback={
                                    <div className="absolute inset-0 flex items-center justify-center text-white/15 text-[11px] tracking-widest">
                                        Loading…
                                    </div>
                                }>
                                    <ModelViewer modelUrl={modelUrl} />
                                </Suspense>
                                <div className="absolute top-4 left-4">
                                    <span className="text-[10px] font-semibold tracking-widest px-2.5 py-1"
                                        style={{ background: "rgba(8,11,16,0.7)", color: "rgba(255,255,255,0.25)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.06)" }}>
                                        3D
                                    </span>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-7 flex-1">
                                {metadata ? (
                                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">

                                        {/* Name + actions */}
                                        <div className="mb-5">
                                            <div className="flex items-start justify-between gap-3 mb-1">
                                                <p className="text-[11px] text-white/25 font-semibold tracking-widest uppercase">02 / Output</p>
                                                {/* Copy + Download */}
                                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                                    <button
                                                        onClick={handleCopyMetadata}
                                                        className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium transition-all"
                                                        style={{
                                                            background: "rgba(255,255,255,0.04)",
                                                            border: "1px solid rgba(255,255,255,0.08)",
                                                            color: "rgba(255,255,255,0.4)",
                                                        }}
                                                        title="Copy metadata JSON"
                                                    >
                                                        <CopySimpleIcon size={11} weight="bold" />
                                                        <span>Copy</span>
                                                    </button>
                                                    <button
                                                        onClick={handleDownloadMetadata}
                                                        className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium transition-all"
                                                        style={{
                                                            background: "rgba(255,255,255,0.04)",
                                                            border: "1px solid rgba(255,255,255,0.08)",
                                                            color: "rgba(255,255,255,0.4)",
                                                        }}
                                                        title="Download metadata JSON"
                                                    >
                                                        <DownloadSimpleIcon size={11} weight="bold" />
                                                        <span>Save</span>
                                                    </button>
                                                </div>
                                            </div>
                                            <h3 className="text-xl font-black text-white leading-tight mt-3"
                                                style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}>
                                                {metadata.name}
                                            </h3>
                                            {metadata.description && (
                                                <p className="text-[12px] text-white/40 leading-relaxed mt-2">
                                                    {metadata.description}
                                                </p>
                                            )}
                                        </div>

                                        <div className="h-px mb-5" style={{ background: "rgba(255,255,255,0.05)" }} />

                                        {/* Properties */}
                                        {metadata.attributes.length > 0 && (
                                            <div className="mb-6" ref={traitsRef}>
                                                <div className="flex items-center justify-between mb-3">
                                                    <p className="text-[11px] font-semibold text-white/25 tracking-widest uppercase">Properties</p>
                                                    <span className="text-[11px] text-white/20">{metadata.attributes.length} traits</span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-px"
                                                    style={{ border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.06)" }}>
                                                    {metadata.attributes.map((attr) => {
                                                        const c = TRAIT_COLORS[attr.trait_type] ?? { border: "#ffffff", label: "#ffffff60", dot: "#ffffff40" };
                                                        return (
                                                            <div
                                                                key={attr.trait_type}
                                                                className="trait-card px-3 py-2.5 flex flex-col gap-1.5"
                                                                style={{
                                                                    background: "#0d1117",
                                                                    transformStyle: "preserve-3d",
                                                                    willChange: "transform",
                                                                }}
                                                            >
                                                                <div className="flex items-center gap-1.5">
                                                                    <span className="w-1.5 h-1.5 flex-shrink-0" style={{ background: c.dot }} />
                                                                    <span className="text-[9px] font-bold uppercase tracking-[0.18em]" style={{ color: c.label }}>
                                                                        {attr.trait_type}
                                                                    </span>
                                                                </div>
                                                                <span className="text-[13px] font-semibold text-white leading-none">{attr.value}</span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {/* Mint */}
                                        <button className="w-full py-3 font-bold text-[12px] tracking-widest uppercase flex items-center justify-center gap-2 transition-all hover:opacity-90"
                                            style={{ background: "#b2ff00", color: "#000" }}>
                                            <LightningIcon size={13} weight="fill" />
                                            Mint NFT
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-center py-10 gap-3">
                                        <div className="w-11 h-11 flex items-center justify-center"
                                            style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
                                            <CubeIcon size={20} weight="duotone" className="text-white/15" />
                                        </div>
                                        <div>
                                            <p className="text-[13px] font-medium text-white/20">Output will appear here</p>
                                            <p className="text-[11px] text-white/10 mt-1">
                                                {image ? "Click Generate to start" : "Upload an image to get started"}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* ── Footer ── */}
            <Footer />

            {/* ── History Drawer ── */}
            <HistoryDrawer open={historyOpen} onClose={() => setHistoryOpen(false)} />
        </div>
    );
}
