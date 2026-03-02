"use client";

import { useCallback, useState, useRef, DragEvent, ChangeEvent, useEffect } from "react";
import {
    UploadSimpleIcon,
    ImageSquareIcon,
    ArrowCounterClockwiseIcon,
    TrashIcon,
    WarningCircleIcon,
} from "@phosphor-icons/react";
import Image from "next/image";

const MAX_SIZE_MB = 10;
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];

function formatSize(bytes: number): string {
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
    const [fileInfo, setFileInfo] = useState<{ name: string; size: string; type: string; dimensions: string | null } | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const prevPreviewRef = useRef<string | null>(null);

    useEffect(() => {
        return () => {
            if (prevPreviewRef.current) URL.revokeObjectURL(prevPreviewRef.current);
        };
    }, []);

    const handleFile = useCallback((file: File) => {
        setError(null);
        if (!ACCEPTED_TYPES.includes(file.type)) {
            setError("Unsupported format — use PNG, JPG or WebP.");
            return;
        }
        if (file.size > MAX_SIZE_MB * 1024 * 1024) {
            setError(`File too large — max ${MAX_SIZE_MB} MB.`);
            return;
        }

        if (prevPreviewRef.current) URL.revokeObjectURL(prevPreviewRef.current);
        const url = URL.createObjectURL(file);
        prevPreviewRef.current = url;
        setPreview(url);

        const img = new window.Image();
        img.onload = () => setFileInfo({
            name: file.name,
            size: formatSize(file.size),
            type: shortMime(file.type),
            dimensions: `${img.naturalWidth}×${img.naturalHeight}`,
        });
        img.onerror = () => setFileInfo({ name: file.name, size: formatSize(file.size), type: shortMime(file.type), dimensions: null });
        img.src = url;

        onChange(file);
    }, [onChange]);

    const onDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handleFile(file);
    }, [handleFile]);

    const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFile(file);
        e.target.value = "";
    };

    const clearImage = () => {
        if (prevPreviewRef.current) { URL.revokeObjectURL(prevPreviewRef.current); prevPreviewRef.current = null; }
        setPreview(null);
        setFileInfo(null);
        setError(null);
        onChange(null);
        if (inputRef.current) inputRef.current.value = "";
    };

    return (
        <div className="w-full select-none flex flex-col gap-2">
            <div
                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                onDragEnter={e => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragging(false); }}
                onDrop={onDrop}
                onClick={() => !preview && inputRef.current?.click()}
                className="group relative w-full overflow-hidden transition-all duration-200"
                style={{
                    minHeight: preview ? "auto" : "148px",
                    cursor: preview ? "default" : "pointer",
                    border: isDragging
                        ? "1px solid rgba(178,255,0,0.5)"
                        : preview
                            ? "1px solid rgba(255,255,255,0.08)"
                            : "1px solid rgba(255,255,255,0.1)",
                    background: isDragging ? "rgba(178,255,0,0.03)" : "rgba(255,255,255,0.02)",
                }}
            >
                {preview && fileInfo ? (
                    /* ── Preview ── */
                    <div className="flex flex-col">
                        {/* Image area */}
                        <div
                            className="group/img relative h-[180px] w-full cursor-pointer overflow-hidden"
                            style={{ background: "#060910" }}
                            onClick={e => { e.stopPropagation(); inputRef.current?.click(); }}
                            title="Click to change"
                        >
                            <Image
                                src={preview}
                                alt="Preview"
                                fill
                                className="object-cover transition-transform duration-500 group-hover/img:scale-105"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                priority
                            />
                            {/* gradient overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

                            {/* top-left badge */}
                            <span
                                className="absolute top-3 left-3 text-[10px] font-bold tracking-widest uppercase px-2 py-1"
                                style={{ background: "rgba(0,0,0,0.65)", color: "rgba(255,255,255,0.5)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.08)" }}
                            >
                                {fileInfo.type}
                            </span>

                            {/* top-right badge */}
                            {fileInfo.dimensions && (
                                <span
                                    className="absolute top-3 right-3 text-[10px] font-bold tracking-wide px-2 py-1"
                                    style={{ background: "rgba(0,0,0,0.65)", color: "rgba(255,255,255,0.5)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.08)" }}
                                >
                                    {fileInfo.dimensions}
                                </span>
                            )}

                            {/* hover overlay */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity duration-200"
                                style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}>
                                <span className="flex items-center gap-2 px-4 py-2 text-[11px] font-semibold tracking-widest uppercase"
                                    style={{ border: "1px solid rgba(178,255,0,0.35)", color: "#b2ff00" }}>
                                    <ArrowCounterClockwiseIcon size={13} weight="bold" />
                                    Change image
                                </span>
                            </div>
                        </div>

                        {/* Info bar */}
                        <div className="flex items-center justify-between px-4 py-3"
                            style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "#161b27" }}>
                            <div className="min-w-0">
                                <p className="truncate text-[12px] font-semibold text-white/70 leading-none mb-1">
                                    {fileInfo.name}
                                </p>
                                <p className="text-[10px] font-medium tracking-widest uppercase text-white/25">
                                    {fileInfo.size} · Ready
                                </p>
                            </div>
                            <button
                                onClick={e => { e.stopPropagation(); clearImage(); }}
                                className="flex-shrink-0 flex items-center gap-1.5 ml-4 px-3 py-1.5 text-[10px] font-semibold tracking-widest uppercase transition-all"
                                style={{ border: "1px solid rgba(255,80,80,0.2)", color: "rgba(255,100,100,0.6)" }}
                                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,80,80,0.45)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,100,100,0.9)"; }}
                                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,80,80,0.2)"; (e.currentTarget as HTMLElement).style.color = "rgba(255,100,100,0.6)"; }}
                                aria-label="Remove image"
                            >
                                <TrashIcon size={11} weight="bold" />
                                Remove
                            </button>
                        </div>
                    </div>
                ) : (
                    /* ── Empty / drag ── */
                    <div className="flex flex-col items-center justify-center gap-4 py-10 px-6 text-center">
                        <div
                            className="w-10 h-10 flex items-center justify-center transition-colors duration-200"
                            style={{
                                border: isDragging ? "1px solid rgba(178,255,0,0.4)" : "1px solid rgba(255,255,255,0.1)",
                                color: isDragging ? "#b2ff00" : "rgba(255,255,255,0.25)",
                            }}
                        >
                            {isDragging
                                ? <ImageSquareIcon size={20} weight="duotone" />
                                : <UploadSimpleIcon size={20} weight="light" />}
                        </div>
                        <div>
                            {isDragging ? (
                                <p className="text-[13px] font-bold tracking-widest uppercase" style={{ color: "#b2ff00" }}>
                                    Drop to upload
                                </p>
                            ) : (
                                <>
                                    <p className="text-[13px] font-semibold text-white/40">
                                        <span
                                            className="font-bold transition-colors group-hover:text-[#b2ff00]"
                                            style={{ color: "rgba(178,255,0,0.7)" }}
                                        >
                                            Click to browse
                                        </span>
                                        {" "}or drag & drop
                                    </p>
                                    <p className="mt-1.5 text-[10px] font-semibold tracking-widest uppercase text-white/20">
                                        PNG · JPG · WebP · Max {MAX_SIZE_MB} MB
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <input
                ref={inputRef}
                type="file"
                accept={ACCEPTED_TYPES.join(",")}
                className="hidden"
                onChange={onInputChange}
                aria-label="Upload image"
            />

            {error && (
                <div className="flex items-center gap-2 px-3 py-2 text-[11px] font-semibold text-red-400"
                    style={{ border: "1px solid rgba(255,80,80,0.15)", background: "rgba(255,80,80,0.05)" }}>
                    <WarningCircleIcon size={13} weight="fill" className="shrink-0" />
                    {error}
                </div>
            )}
        </div>
    );
}
