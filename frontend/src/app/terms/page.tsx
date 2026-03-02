import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import LenisWrapper from "@/components/LenisWrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Terms of Service — NFTP",
    description: "Terms of service for the NFTP platform.",
};

const TERMS = [
    {
        num: "01",
        title: "Acceptance of terms",
        body: `By accessing or using NFTP ("the platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the platform. NFTP is provided "as is" for educational and experimental purposes. The platform operates on public testnets and does not involve real monetary value.`,
    },
    {
        num: "02",
        title: "Use of the platform",
        body: `You may use NFTP to generate 3D models and NFT metadata from images you own or have rights to use. You are solely responsible for ensuring that any content you upload does not infringe on third-party intellectual property, contain illegal material, or violate any applicable laws.`,
    },
    {
        num: "03",
        title: "AI-generated content",
        body: `NFTP uses third-party AI services (Tripo AI, Groq) to generate 3D models and metadata. We do not guarantee the accuracy, quality, or suitability of any AI-generated content. AI outputs may sometimes be unexpected or inaccurate. You accept full responsibility for how you use AI-generated content.`,
    },
    {
        num: "04",
        title: "Blockchain and wallets",
        body: `NFTP interacts with public blockchain testnets (Ethereum Sepolia, Base Sepolia). Connecting a wallet is optional and at your own risk. We do not store private keys, seed phrases, or wallet credentials. All blockchain interactions happen client-side through your connected wallet.`,
    },
    {
        num: "05",
        title: "Intellectual property",
        body: `You retain all rights to the original images you upload. By uploading content, you grant NFTP a limited, non-exclusive license to process your images for the purpose of generating 3D models and metadata. Generated assets are owned by you. The source code is released under the MIT License.`,
    },
    {
        num: "06",
        title: "Limitation of liability",
        body: `NFTP is provided for experimental and educational purposes only. To the maximum extent permitted by law, NFTP and its contributors shall not be liable for any direct, indirect, incidental, or consequential damages arising from your use of the platform.`,
    },
    {
        num: "07",
        title: "Changes to terms",
        body: `We may update these Terms at any time. Continued use of the platform after changes constitutes acceptance of the new Terms. We will update the date of the last update at the top of this page.`,
    },
    {
        num: "08",
        title: "Contact",
        body: `For questions about these Terms, please contact us at hello@nftp.xyz.`,
    },
];

export default function TermsPage() {
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
                                        Legal
                                    </span>
                                </div>
                                <h1
                                    className="font-black leading-[0.92] tracking-tight"
                                    style={{ fontSize: "clamp(4rem, 10vw, 9rem)" }}
                                >
                                    Terms of
                                    <br />
                                    <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "#b2ff00" }}>Service</span>
                                </h1>
                            </div>
                            <div className="md:max-w-xs md:text-right md:pb-3">
                                <p className="text-[14px] text-white/45 leading-relaxed mb-3">
                                    Last updated: February 28, 2026
                                </p>
                                <a
                                    href="mailto:hello@nftp.xyz"
                                    className="inline-flex items-center gap-2 text-[12px] font-semibold tracking-widest uppercase text-white/60 hover:text-[#b2ff00] transition-colors"
                                >
                                    hello@nftp.xyz →
                                </a>
                            </div>
                        </div>

                        {/* ── Sections ── */}
                        <div className="flex flex-col">
                            {TERMS.map((t) => (
                                <div
                                    key={t.num}
                                    className="py-8 flex flex-col md:flex-row gap-6 md:gap-12"
                                    style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
                                >
                                    {/* Number + title */}
                                    <div className="md:w-64 flex-shrink-0">
                                        <div className="flex items-baseline gap-3 mb-1">
                                            <span className="text-[12px] font-semibold text-white/20">{t.num} /</span>
                                            <h2 className="text-[15px] font-bold text-white">{t.title}</h2>
                                        </div>
                                    </div>
                                    {/* Body */}
                                    <p className="flex-1 text-[13px] text-white/45 leading-[1.9]">{t.body}</p>
                                </div>
                            ))}
                            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }} />
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </LenisWrapper>
    );
}
