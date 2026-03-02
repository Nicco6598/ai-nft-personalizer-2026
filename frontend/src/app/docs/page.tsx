import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import LenisWrapper from "@/components/LenisWrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Docs — NFTP",
    description: "Developer documentation for NFTP — the open-source AI NFT generator.",
};

const SECTIONS = [
    {
        id: "overview",
        label: "Overview",
        num: "01",
        title: "What is NFTP?",
        content: `NFTP (NFT Personalizer) is an open-source platform that lets anyone turn a static image into a fully minted 3D NFT using AI. No design experience, no coding skills, no gas fees required — just upload and create.`,
    },
    {
        id: "architecture",
        label: "Architecture",
        num: "02",
        title: "System architecture",
        content: `The stack is split into two services:\n\n• Frontend — Next.js 15 + React 19 + Tailwind CSS 4. Handles the UI, 3D model viewer (React Three Fiber), wallet connection (wagmi v3), and state management (Zustand).\n\n• Backend — FastAPI (Python). Accepts image uploads, calls Tripo AI for 3D generation, Groq for metadata, and Pinata for IPFS pinning. Returns a model URL and NFT metadata JSON.`,
    },
    {
        id: "api",
        label: "API Reference",
        num: "03",
        title: "API reference",
        content: `POST /api/generate\n\nAccepts a multipart/form-data body:\n• image — the image file (JPG/PNG, max 10 MB)\n• style_prompt — optional string describing the desired aesthetic\n\nReturns JSON:\n{\n  "model_url": "https://...",\n  "metadata": {\n    "name": "...",\n    "description": "...",\n    "image": "ipfs://...",\n    "model_url": "ipfs://...",\n    "attributes": [...]\n  }\n}`,
    },
    {
        id: "self-hosting",
        label: "Self-hosting",
        num: "04",
        title: "Self-hosting guide",
        content: `1. Clone the repo:\ngit clone https://github.com/your-org/ai-nft-personalizer-2026\n\n2. Backend setup:\ncd backend && pip install -r requirements.txt\nCreate a .env file with TRIPO_API_KEY, GROQ_API_KEY, PINATA_JWT, SUPABASE_URL, SUPABASE_KEY\nuvicorn app.main:app --reload\n\n3. Frontend setup:\ncd frontend && npm install\nCreate .env.local with NEXT_PUBLIC_API_URL=http://localhost:8000\nnpm run dev`,
    },
    {
        id: "env",
        label: "Environment variables",
        num: "05",
        title: "Environment variables",
        content: `Backend (.env):\n• TRIPO_API_KEY — Tripo AI key for 3D generation\n• GROQ_API_KEY — Groq key for LLM metadata generation\n• PINATA_JWT — Pinata JWT for IPFS pinning\n• SUPABASE_URL — Supabase project URL\n• SUPABASE_KEY — Supabase anon key\n\nFrontend (.env.local):\n• NEXT_PUBLIC_API_URL — URL of the FastAPI backend`,
    },
];

export default function DocsPage() {
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
                                        Documentation
                                    </span>
                                </div>
                                <h1
                                    className="font-black leading-[0.92] tracking-tight"
                                    style={{ fontSize: "clamp(4rem, 10vw, 9rem)" }}
                                >
                                    Developer
                                    <br />
                                    <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "#b2ff00" }}>Docs</span>
                                </h1>
                            </div>
                            <div className="md:max-w-xs md:text-right md:pb-3">
                                <p className="text-[14px] text-white/45 leading-relaxed mb-5">
                                    Everything you need to understand, run, and extend NFTP.
                                    MIT licensed and open source.
                                </p>
                                <a
                                    href="#"
                                    className="inline-flex items-center gap-2 text-[12px] font-semibold tracking-widest uppercase text-white/60 hover:text-[#b2ff00] transition-colors"
                                >
                                    GitHub →
                                </a>
                            </div>
                        </div>

                        {/* ── Content ── */}
                        <div className="flex flex-col lg:flex-row gap-12">

                            {/* Sidebar */}
                            <aside className="lg:w-48 flex-shrink-0">
                                <div className="sticky top-24 flex flex-row lg:flex-col gap-1 flex-wrap">
                                    {SECTIONS.map(s => (
                                        <a
                                            key={s.id}
                                            href={`#${s.id}`}
                                            className="flex items-center gap-3 px-3 py-2 text-[11px] font-semibold tracking-widest uppercase transition-colors hover:text-[#b2ff00]"
                                            style={{ color: "rgba(255,255,255,0.3)" }}
                                        >
                                            <span style={{ color: "rgba(255,255,255,0.15)" }}>{s.num}</span>
                                            {s.label}
                                        </a>
                                    ))}
                                </div>
                            </aside>

                            {/* Sections */}
                            <div className="flex-1 flex flex-col">
                                {SECTIONS.map((s, i) => (
                                    <div
                                        key={s.id}
                                        id={s.id}
                                        className="py-10"
                                        style={{
                                            borderTop: "1px solid rgba(255,255,255,0.06)",
                                            borderBottom: i === SECTIONS.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none",
                                        }}
                                    >
                                        <div className="flex items-baseline gap-4 mb-5">
                                            <span className="text-[12px] font-semibold text-white/20">{s.num} /</span>
                                            <h2 className="text-[18px] font-bold text-white">{s.title}</h2>
                                        </div>
                                        <pre
                                            className="text-[13px] leading-7 whitespace-pre-wrap pl-10"
                                            style={{
                                                color: "rgba(255,255,255,0.50)",
                                                fontFamily: "'Inter', monospace",
                                            }}
                                        >
                                            {s.content}
                                        </pre>
                                    </div>
                                ))}

                                {/* GitHub CTA */}
                                <div
                                    className="mt-10 p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
                                    style={{ border: "1px solid rgba(178,255,0,0.12)", background: "#161b27" }}
                                >
                                    <div>
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-5 h-px" style={{ background: "#b2ff00" }} />
                                            <span className="text-[11px] font-semibold tracking-[0.18em] text-white/30 uppercase">Open source</span>
                                        </div>
                                        <p className="text-[14px] font-bold text-white mb-1">MIT Licensed</p>
                                        <p className="text-[12px] text-white/35">PRs and issues are welcome on GitHub.</p>
                                    </div>
                                    <a
                                        href="#"
                                        className="flex-shrink-0 flex items-center gap-3 text-[12px] font-semibold tracking-widest uppercase text-white/60 hover:text-[#b2ff00] transition-colors"
                                    >
                                        View on GitHub →
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </LenisWrapper>
    );
}
