import Link from "next/link";
import { StackSimple as StackSimpleIcon } from "@phosphor-icons/react/dist/ssr";

const PRODUCT_LINKS = [
    { label: "Studio", href: "/#studio" },
    { label: "Explore", href: "/explore" },
    { label: "Roadmap", href: "/roadmap" },
];

const COMMUNITY_LINKS = [
    { label: "Twitter", href: "#" },
    { label: "Discord", href: "#" },
    { label: "GitHub", href: "#" },
];

const LEGAL_LINKS = [
    { label: "Terms", href: "/terms" },
    { label: "Privacy", href: "/privacy" },
];

export default function Footer() {
    return (
        <footer
            className="px-6 md:px-10 py-12"
            style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2.5 mb-3">
                            <div className="w-5 h-5 rounded-md bg-[#b2ff00] flex items-center justify-center">
                                <StackSimpleIcon size={11} weight="bold" className="text-black" />
                            </div>
                            <span className="font-bold text-[13px] text-white tracking-tight">NFTP</span>
                        </div>
                        <p className="text-[12px] text-white/25 max-w-xs leading-relaxed">
                            Generative 3D NFTs from your images.
                        </p>
                    </div>

                    {/* Link columns */}
                    <div className="flex gap-12">
                        <div>
                            <p className="text-[10px] font-semibold text-white/20 mb-3 tracking-wider">Product</p>
                            <div className="flex flex-col gap-2.5">
                                {PRODUCT_LINKS.map(({ label, href }) => (
                                    <Link
                                        key={label}
                                        href={href}
                                        className="text-[12px] text-white/30 hover:text-white/70 transition-colors"
                                    >
                                        {label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-semibold text-white/20 mb-3 tracking-wider">Community</p>
                            <div className="flex flex-col gap-2.5">
                                {COMMUNITY_LINKS.map(({ label, href }) => (
                                    <a
                                        key={label}
                                        href={href}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-[12px] text-white/30 hover:text-white/70 transition-colors"
                                    >
                                        {label}
                                    </a>
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="text-[10px] font-semibold text-white/20 mb-3 tracking-wider">Legal</p>
                            <div className="flex flex-col gap-2.5">
                                {LEGAL_LINKS.map(({ label, href }) => (
                                    <Link
                                        key={label}
                                        href={href}
                                        className="text-[12px] text-white/30 hover:text-white/70 transition-colors"
                                    >
                                        {label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}
                >
                    <span className="text-[11px] text-white/15">© 2026 NFTP. All rights reserved.</span>
                    <span className="text-[11px] text-white/15">hello@nftp.xyz</span>
                </div>
            </div>
        </footer>
    );
}
