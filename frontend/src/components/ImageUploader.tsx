"use client";

import { useCallback, useState, useRef, DragEvent, ChangeEvent } from "react";
import { CloudArrowUpIcon, XIcon, ImageSquareIcon, CheckCircleIcon } from "@phosphor-icons/react";
import Image from "next/image";

const MAX_SIZE_MB = 10;

interface ImageUploaderProps {
    onChange: (file: File | null) => void;
}

export default function ImageUploader({ onChange }: ImageUploaderProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = useCallback(
        (file: File) => {
            setError(null);
            if (!file.type.startsWith("image/")) {
                setError("Please upload an image file.");
                return;
            }
            if (file.size > MAX_SIZE_MB * 1024 * 1024) {
                setError(`Max file size is ${MAX_SIZE_MB} MB.`);
                return;
            }
            setPreview(URL.createObjectURL(file));
            setFileName(file.name);
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
    };

    const clearImage = () => {
        setPreview(null);
        setFileName(null);
        onChange(null);
        if (inputRef.current) inputRef.current.value = "";
    };

    return (
        <div className="w-full">
            <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
                onClick={() => !preview && inputRef.current?.click()}
                className="relative w-full select-none overflow-hidden rounded-xl transition-all duration-200"
                style={{
                    cursor: preview ? "default" : "pointer",
                    border: isDragging
                        ? "1px solid rgba(178,255,0,0.5)"
                        : preview
                            ? "1px solid rgba(255,255,255,0.08)"
                            : "1px dashed rgba(255,255,255,0.1)",
                    background: isDragging
                        ? "rgba(178,255,0,0.04)"
                        : "rgba(6,9,16,0.8)",
                }}
            >
                {preview ? (
                    /* ── Preview state ── */
                    <div className="relative">
                        {/* Image */}
                        <div className="relative w-full h-[200px]">
                            <Image
                                src={preview}
                                alt="Uploaded preview"
                                fill
                                className="object-cover"
                            />
                            {/* Gradient overlay bottom */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#060910]/80 via-transparent to-transparent pointer-events-none" />
                        </div>

                        {/* Bottom info bar */}
                        <div className="px-3 py-2.5 flex items-center justify-between gap-3"
                            style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                            <div className="flex items-center gap-2 min-w-0">
                                <CheckCircleIcon size={13} weight="fill" className="text-[#b2ff00] flex-shrink-0" />
                                <span className="text-[11px] text-white/50 font-medium truncate">
                                    {fileName}
                                </span>
                            </div>
                            <button
                                onClick={(e) => { e.stopPropagation(); clearImage(); }}
                                className="flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-white/30 hover:text-white hover:bg-red-500/20 transition-all"
                                aria-label="Remove image"
                            >
                                <XIcon size={12} weight="bold" />
                            </button>
                        </div>
                    </div>
                ) : (
                    /* ── Empty state ── */
                    <div className="flex flex-col items-center justify-center gap-4 px-8 py-10">
                        {/* Icon */}
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center transition-all"
                            style={{
                                background: isDragging ? "rgba(178,255,0,0.12)" : "rgba(255,255,255,0.04)",
                                border: isDragging ? "1px solid rgba(178,255,0,0.3)" : "1px solid rgba(255,255,255,0.08)",
                            }}
                        >
                            {isDragging
                                ? <ImageSquareIcon size={20} weight="duotone" style={{ color: "#b2ff00" }} />
                                : <CloudArrowUpIcon size={20} weight="light" className="text-white/25" />
                            }
                        </div>

                        {/* Text */}
                        <div className="text-center">
                            <p className="text-[13px] font-semibold text-white/50">
                                {isDragging ? (
                                    <span style={{ color: "#b2ff00" }}>Drop to upload</span>
                                ) : (
                                    <>
                                        <span
                                            className="font-bold transition-colors"
                                            style={{ color: "#b2ff00" }}
                                        >
                                            Click to browse
                                        </span>
                                        {" "}or drag & drop
                                    </>
                                )}
                            </p>
                            <p className="text-[10px] text-white/20 mt-1.5 tracking-wide">
                                PNG · JPG · WebP &nbsp;·&nbsp; max {MAX_SIZE_MB} MB
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={onInputChange}
                id="image-upload-input"
            />

            {error && (
                <p className="mt-2 text-[11px] font-medium text-red-400 px-1 flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-red-400 flex-shrink-0" />
                    {error}
                </p>
            )}
        </div>
    );
}
