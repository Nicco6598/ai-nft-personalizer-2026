import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import LenisWrapper from "@/components/LenisWrapper";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Privacy Policy — NFTP",
    description: "Privacy policy for the NFTP platform.",
};

const SECTIONS = [
    {
        num: "01",
        title: "Information we collect",
        body: `NFTP collects minimal information necessary to provide the service:\n\n• Images you upload — temporarily processed to generate 3D models and metadata, then discarded. Images are not stored permanently.\n• Wallet address — only if you connect a Web3 wallet. We receive your public address only; we never access private keys.\n• Generation history — stored locally in your browser's localStorage. We do not have access to this data.\n• Usage analytics — anonymous aggregated data (page views, feature usage) may be collected via privacy-friendly analytics.`,
    },
    {
        num: "02",
        title: "How we use your information",
        body: `We use the information we collect solely to:\n\n• Process your image and return a 3D model and NFT metadata\n• Pin your assets to IPFS via Pinata when requested\n• Improve the platform based on aggregate usage patterns\n\nWe do not sell, rent, or share your personal information with third parties for marketing purposes.`,
    },
    {
        num: "03",
        title: "Third-party services",
        body: `NFTP integrates with the following third-party services. Each has its own privacy policy:\n\n• Tripo AI — processes your image to generate 3D models\n• Groq — processes image metadata to generate NFT attributes\n• Pinata — pins your assets to the IPFS network\n• Supabase — database for generated asset records (anonymized)\n\nBy using NFTP you acknowledge that your image data passes through these services for processing.`,
    },
    {
        num: "04",
        title: "Cookies and local storage",
        body: `NFTP uses browser localStorage to store your generation history locally. This data never leaves your device. We do not use tracking cookies or advertising cookies. Session state is managed in-memory and cleared when you close the browser tab.`,
    },
    {
        num: "05",
        title: "Blockchain data",
        body: `When you mint an NFT, your wallet address and the token metadata become permanently recorded on a public blockchain. This is inherent to how blockchain technology works. Do not mint if you do not wish to associate your wallet address with the generated asset on a public ledger.`,
    },
    {
        num: "06",
        title: "Data retention",
        body: `Uploaded images are deleted from our servers immediately after processing. IPFS-pinned assets remain accessible as long as the pin is maintained. Generation records in our database are anonymized. Your local history can be cleared at any time from the History drawer in the app.`,
    },
    {
        num: "07",
        title: "Your rights",
        body: `You have the right to access information about what data we hold, request deletion of any data associated with your session, and opt out of any analytics collection. To exercise these rights, contact us at hello@nftp.xyz.`,
    },
    {
        num: "08",
        title: "Changes to this policy",
        body: `We may update this Privacy Policy from time to time. We will update the "Last updated" date at the top of this page. Continued use of the platform constitutes acceptance of the updated policy.`,
    },
];

export default function PrivacyPage() {
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
                                    Privacy
                                    <br />
                                    <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", color: "#b2ff00" }}>Policy</span>
                                </h1>
                            </div>
                            <div className="md:max-w-xs md:text-right md:pb-3">
                                <p className="text-[14px] text-white/45 leading-relaxed mb-5">
                                    Last updated: February 28, 2026
                                </p>
                                {/* TL;DR */}
                                <div
                                    className="text-left p-4 mt-2"
                                    style={{ border: "1px solid rgba(178,255,0,0.12)", background: "rgba(178,255,0,0.04)" }}
                                >
                                    <p className="text-[11px] font-semibold text-white/30 mb-1 tracking-widest uppercase">TL;DR</p>
                                    <p className="text-[12px] text-white/50 leading-relaxed">
                                        We process your image to generate a 3D NFT, we don&apos;t sell your data,
                                        and your history lives only in your browser.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* ── Sections ── */}
                        <div className="flex flex-col">
                            {SECTIONS.map((s) => (
                                <div
                                    key={s.num}
                                    className="py-8 flex flex-col md:flex-row gap-6 md:gap-12"
                                    style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
                                >
                                    {/* Number + title */}
                                    <div className="md:w-64 flex-shrink-0">
                                        <div className="flex items-baseline gap-3">
                                            <span className="text-[12px] font-semibold text-white/20">{s.num} /</span>
                                            <h2 className="text-[15px] font-bold text-white">{s.title}</h2>
                                        </div>
                                    </div>
                                    {/* Body */}
                                    <p className="flex-1 text-[13px] text-white/45 leading-[1.9] whitespace-pre-line">{s.body}</p>
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
