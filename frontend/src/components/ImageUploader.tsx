"use client";

import { useCallback, useState, useRef, DragEvent, ChangeEvent, useEffect } from "react";
import {
    UploadSimpleIcon,
    XIcon,
    ImageSquareIcon,
    CheckCircleIcon,
    FileImageIcon,
    ArrowsOutIcon,
    WarningCircleIcon,
} from "@phosphor-icons/react";
import Image from "next/image";

const MAX_SIZE_MB = 10;
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];
const ACCEPTED_LABELS = "PNG · JPG · WebP";

interface FileInfo {
    name: string;
    sizeMb: string;
    type: string;
    dimensions: string | null;
}

function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function shortMime(type: string): string {
    return type.replace("image/", "").toUpperCase();
}

interface ImageUploaderProps {
    onChange: (file: File | null) => void;
}

export default function ImageUploader({ onChange }: ImageUploaderProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isHovered, setIsHovered] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const prevPreviewRef = useRef<string | null>(null);

    // Revoke previous object URL to avoid memory leaks
    useEffect(() => {
        return () => {
            if (prevPreviewRef.current) URL.revokeObjectURL(prevPreviewRef.current);
        };
    }, []);

    const handleFile = useCallback(
        (file: File) => {
            setError(null);

            if (!ACCEPTED_TYPES.includes(file.type)) {
                setError("Unsupported format. Use PNG, JPG or WebP.");
                return;
            }
            if (file.size > MAX_SIZE_MB * 1024 * 1024) {
                setError(`File too large. Max ${MAX_SIZE_MB} MB.`);
                return;
            }

            // Revoke previous URL
            if (prevPreviewRef.current) URL.revokeObjectURL(prevPreviewRef.current);

            const url = URL.createObjectURL(file);
            prevPreviewRef.current = url;
            setPreview(url);

            // Read image dimensions
            const img = new window.Image();
            img.onload = () => {
                setFileInfo({
                    name: file.name,
                    sizeMb: formatSize(file.size),
                    type: shortMime(file.type),
                    dimensions: `${img.naturalWidth}×${img.naturalHeight}`,
                });
            };
            img.onerror = () => {
                setFileInfo({
                    name: file.name,
                    sizeMb: formatSize(file.size),
                    type: shortMime(file.type),
                    dimensions: null,
                });
            };
            img.src = url;

            onChange(file);
        },
        [onChange]
    );

    const onDrop = useCallback(
        (e: DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file) handleFile(file);
        },
        [handleFile]
    );

    const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
        // Reset input value so same file can be re-uploaded
        e.target.value = "";
    };

    const clearImage = () => {
        if (prevPreviewRef.current) {
            URL.revokeObjectURL(prevPreviewRef.current);
            prevPreviewRef.current = null;
        }
        setPreview(null);
        setFileInfo(null);
        setError(null);
        onChange(null);
        if (inputRef.current) inputRef.current.value = "";
    };

    return (
        <div className="w-full select-none">
            <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={(e) => {
                    // Only clear if leaving the component entirely
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                        setIsDragging(false);
                    }
                }}
                onDrop={onDrop}
                onClick={() => !preview && inputRef.current?.click()}
                onMouseEnter={() => !preview && setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="relative w-full rounded-2xl overflow-hidden"
                style={{
                    cursor: preview ? "default" : "pointer",
                    transition: "border-color 0.2s ease, background 0.2s ease",
                    border: isDragging
                        ? "1.5px dashed rgba(178,255,0,0.6)"
                        : preview
                            ? "1px solid rgba(255,255,255,0.08)"
                            : isHovered
                                ? "1.5px dashed rgba(255,255,255,0.18)"
                                : "1.5px dashed rgba(255,255,255,0.08)",
                    background: isDragging
                        ? "rgba(178,255,0,0.035)"
                        : "rgba(255,255,255,0.02)",
                }}
            >
                {preview && fileInfo ? (
                    /* ── Preview state ── */
                    <div>
                        {/* Image */}
                        <div className="relative w-full h-[188px]">
                            <Image
                                src={preview}
                                alt="Uploaded preview"
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                priority
                            />
                            {/* Gradient overlay */}
                            <div
                                className="absolute inset-0 pointer-events-none"
                                style={{ background: "linear-gradient(to top, rgba(6,9,16,0.75) 0%, rgba(6,9,16,0.1) 40%, transparent 70%)" }}
                            />

                            {/* Type badge — top left */}
                            <div
                                className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
                                style={{
                                    background: "rgba(8,11,16,0.75)",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                    backdropFilter: "blur(8px)",
                                }}
                            >
                                <FileImageIcon size={10} weight="fill" style={{ color: "rgba(178,255,0,0.7)" }} />
                                <span className="text-[9px] font-bold tracking-wider" style={{ color: "rgba(255,255,255,0.5)" }}>
                                    {fileInfo.type}
                                </span>
                            </div>

                            {/* Dimensions badge — top right */}
                            {fileInfo.dimensions && (
                                <div
                                    className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
                                    style={{
                                        background: "rgba(8,11,16,0.75)",
                                        border: "1px solid rgba(255,255,255,0.08)",
                                        backdropFilter: "blur(8px)",
                                    }}
                                >
                                    <ArrowsOutIcon size={10} style={{ color: "rgba(255,255,255,0.35)" }} />
                                    <span className="text-[9px] font-semibold" style={{ color: "rgba(255,255,255,0.4)" }}>
                                        {fileInfo.dimensions}
                                    </span>
                                </div>
                            )}

                            {/* Remove button — bottom right */}
                            <button
                                onClick={(e) => { e.stopPropagation(); clearImage(); }}
                                className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl
                                           transition-all hover:bg-red-500/25"
                                style={{
                                    background: "rgba(8,11,16,0.75)",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                    backdropFilter: "blur(8px)",
                                    color: "rgba(255,255,255,0.4)",
                                }}
                                aria-label="Remove image"
                            >
                                <XIcon size={11} weight="bold" />
                                <span className="text-[10px] font-semibold">Remove</span>
                            </button>
                        </div>

                        {/* ── File info bar ── */}
                        <div
                            className="flex items-center gap-3 px-3.5 py-3"
                            style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
                        >
                            {/* Check icon */}
                            <CheckCircleIcon size={14} weight="fill" style={{ color: "#b2ff00", flexShrink: 0 }} />

                            {/* Filename */}
                            <div className="flex-1 min-w-0">
                                <p className="text-[11px] font-semibold text-white/65 truncate leading-none">
                                    {fileInfo.name}
                                </p>
                                <p className="text-[9px] text-white/25 mt-1 leading-none tracking-wide">
                                    Ready for generation
                                </p>
                            </div>

                            {/* Separator */}
                            <div className="w-px h-6 flex-shrink-0" style={{ background: "rgba(255,255,255,0.06)" }} />

                            {/* File size */}
                            <div className="flex-shrink-0 text-right">
                                <p className="text-[11px] font-semibold" style={{ color: "rgba(178,255,0,0.75)" }}>
                                    {fileInfo.sizeMb}
                                </p>
                                <p className="text-[9px] text-white/20 mt-1 leading-none">size</p>
                            </div>

                            {/* Click to change */}
                            <button
                                onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
                                className="flex-shrink-0 text-[10px] font-semibold px-2.5 py-1.5 rounded-lg transition-all"
                                style={{
                                    background: "rgba(255,255,255,0.04)",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                    color: "rgba(255,255,255,0.3)",
                                }}
                                onMouseEnter={e => {
                                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.08)";
                                    (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.6)";
                                }}
                                onMouseLeave={e => {
                                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                                    (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.3)";
                                }}
                                aria-label="Change image"
                            >
                                Change
                            </button>
                        </div>
                    </div>
                ) : (
                    /* ── Empty / drag state ── */
                    <div className="flex flex-col items-center justify-center gap-5 px-8 py-10">
                        {/* Icon */}
                        <div
                            style={{
                                width: 48, height: 48, borderRadius: 16,
                                background: isDragging ? "rgba(178,255,0,0.1)" : "rgba(255,255,255,0.03)",
                                border: `1px solid ${isDragging ? "rgba(178,255,0,0.35)" : "rgba(255,255,255,0.07)"}`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                transition: "all 0.2s ease",
                                boxShadow: isDragging ? "0 0 20px rgba(178,255,0,0.12)" : "none",
                            }}
                        >
                            {isDragging
                                ? <ImageSquareIcon size={22} weight="duotone" style={{ color: "#b2ff00" }} />
                                : <UploadSimpleIcon size={22} weight="light" style={{ color: isHovered ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.2)" }} />
                            }
                        </div>

                        {/* Text */}
                        <div className="text-center">
                            {isDragging ? (
                                <p className="text-[13px] font-bold" style={{ color: "#b2ff00" }}>
                                    Drop to upload
                                </p>
                            ) : (
                                <>
                                    <p className="text-[13px] font-semibold" style={{ color: "rgba(255,255,255,0.5)" }}>
                                        <span
                                            className="font-bold"
                                            style={{ color: isHovered ? "#b2ff00" : "rgba(178,255,0,0.8)", transition: "color 0.2s" }}
                                        >
                                            Click to browse
                                        </span>
                                        <span style={{ color: "rgba(255,255,255,0.25)" }}> or drag & drop</span>
                                    </p>
                                    <p className="text-[10px] mt-2 tracking-wide" style={{ color: "rgba(255,255,255,0.18)" }}>
                                        {ACCEPTED_LABELS} &nbsp;·&nbsp; max {MAX_SIZE_MB} MB
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Hidden input */}
            <input
                ref={inputRef}
                type="file"
                accept={ACCEPTED_TYPES.join(",")}
                className="hidden"
                onChange={onInputChange}
                aria-label="Upload image"
            />

            {/* Error */}
            {error && (
                <p className="mt-2.5 text-[11px] font-medium text-red-400 flex items-center gap-1.5 px-0.5">
                    <WarningCircleIcon size={12} weight="fill" className="flex-shrink-0" />
                    {error}
                </p>
            )}
        </div>
    );
}
