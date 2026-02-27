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
    ArrowCounterClockwiseIcon,
    TrashIcon,
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
        <div className="w-full select-none flex flex-col gap-2">
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
                className={`group relative flex w-full flex-col items-center justify-center overflow-hidden rounded-2xl transition-all duration-200 ${preview
                    ? "cursor-default bg-white/5 border border-white/10"
                    : isDragging
                        ? "cursor-pointer bg-[#b2ff00]/5 border-2 border-dashed border-[#b2ff00]/60 shadow-[0_0_20px_rgba(178,255,0,0.1)]"
                        : "cursor-pointer bg-white/5 border-2 border-dashed border-white/20 hover:border-white/40 hover:bg-white/10"
                    }`}
                style={{
                    minHeight: preview ? "220px" : "160px",
                }}
            >
                {preview && fileInfo ? (
                    /* ── Preview state ── */
                    <div className="flex h-full w-full flex-col">
                        {/* Image Header Area */}
                        <div
                            className="group/img relative h-[170px] w-full cursor-pointer bg-black/40 border-b border-white/10 overflow-hidden rounded-t-2xl"
                            onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
                            title="Click to change image"
                        >
                            <Image
                                src={preview}
                                alt="Uploaded preview"
                                fill
                                className="object-cover transition-transform duration-500 group-hover/img:scale-105"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                priority
                            />
                            {/* Inner Top Gradients/Badges */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                            <div className="absolute top-3 left-3 flex items-center justify-center gap-2 rounded-lg bg-black/60 px-2 py-1 backdrop-blur-md border border-white/10 text-[10px] font-bold tracking-wider text-white/70 shadow-lg">
                                <FileImageIcon size={12} weight="fill" className="text-[#b2ff00]" />
                                {fileInfo.type}
                            </div>

                            {fileInfo.dimensions && (
                                <div className="absolute top-3 right-3 flex items-center justify-center gap-2 rounded-lg bg-black/60 px-2 py-1 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white/70 shadow-lg">
                                    <ArrowsOutIcon size={12} />
                                    {fileInfo.dimensions}
                                </div>
                            )}

                            {/* Hover overlay hint (Change Image) */}
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover/img:opacity-100">
                                <div className="flex items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-[11px] font-bold uppercase tracking-widest text-[#b2ff00] backdrop-blur-md border border-[#b2ff00]/30 shadow-2xl">
                                    <ArrowCounterClockwiseIcon size={14} weight="bold" />
                                    Change Image
                                </div>
                            </div>
                        </div>

                        {/* File Info Bar */}
                        <div className="flex flex-1 items-center justify-between px-4 py-3 bg-[#0d1118]/80 backdrop-blur-sm">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#b2ff00]/10 text-[#b2ff00] border border-[#b2ff00]/20">
                                    <CheckCircleIcon size={16} weight="fill" />
                                </div>
                                <div className="min-w-0">
                                    <p className="truncate text-xs font-semibold text-white/90">
                                        {fileInfo.name}
                                    </p>
                                    <p className="text-[10px] text-white/40 mt-0.5 tracking-wide">
                                        {fileInfo.sizeMb} • Ready for generation
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={(e) => { e.stopPropagation(); clearImage(); }}
                                className="shrink-0 flex items-center gap-1.5 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-[10px] font-bold text-red-400 transition-all hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/40"
                                aria-label="Remove image"
                            >
                                <TrashIcon size={12} weight="bold" />
                                Remove
                            </button>
                        </div>
                    </div>
                ) : (
                    /* ── Empty / drag state ── */
                    <div className="flex flex-col items-center justify-center gap-3 px-6 py-8 text-center">
                        <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-200 ${isDragging
                            ? "bg-[#b2ff00]/10 text-[#b2ff00] border border-[#b2ff00]/30"
                            : "bg-white/5 text-white/30 border border-white/10 group-hover:bg-white/10 group-hover:text-white/60 group-hover:border-white/20"
                            }`}>
                            {isDragging ? (
                                <ImageSquareIcon size={24} weight="duotone" />
                            ) : (
                                <UploadSimpleIcon size={24} weight="light" />
                            )}
                        </div>

                        <div>
                            {isDragging ? (
                                <p className="text-sm font-bold text-[#b2ff00]">
                                    Drop to upload here
                                </p>
                            ) : (
                                <>
                                    <p className="text-sm font-semibold text-white/50">
                                        <span className="font-bold text-[#b2ff00]/80 transition-colors group-hover:text-[#b2ff00]">Click to browse</span>
                                        {" "}or drag & drop
                                    </p>
                                    <p className="mt-1 text-[11px] font-medium tracking-wide text-white/30">
                                        {ACCEPTED_LABELS} • Max {MAX_SIZE_MB}MB
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

            {/* Error Message */}
            {error && (
                <div className="flex w-full items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-400">
                    <WarningCircleIcon size={14} weight="fill" className="shrink-0" />
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
}
