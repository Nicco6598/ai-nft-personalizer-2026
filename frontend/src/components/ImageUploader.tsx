"use client";

import { useCallback, useState, useRef, DragEvent, ChangeEvent } from "react";
import { UploadCloud, X, ImageIcon } from "lucide-react";
import Image from "next/image";

const MAX_SIZE_MB = 10;

interface ImageUploaderProps {
    onChange: (file: File | null) => void;
}

export default function ImageUploader({ onChange }: ImageUploaderProps) {
    const [preview, setPreview] = useState<string | null>(null);
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
                className={[
                    "relative flex flex-col items-center justify-center w-full min-h-[220px] transition-all duration-100 cursor-pointer select-none",
                    isDragging
                        ? "border-2 border-cyan-400 bg-cyan-500/10 scale-[1.01] shadow-[0_0_20px_rgba(20,241,255,0.2)]"
                        : "border border-cyan-500/30 bg-black hover:border-cyan-400 hover:bg-cyan-500/5",
                    preview ? "cursor-default" : "",
                ].join(" ")}
            >
                {preview ? (
                    <>
                        <Image
                            src={preview}
                            alt="Uploaded preview"
                            fill
                            className="object-cover p-1 opacity-80"
                        />
                        <div className="absolute inset-0 bg-cyan-500/10 mix-blend-overlay pointer-events-none" />
                        <button
                            onClick={(e) => { e.stopPropagation(); clearImage(); }}
                            className="absolute top-4 right-4 z-10 bg-black/80 border border-cyan-500/50 p-2 text-cyan-400 hover:bg-red-500 hover:text-white transition-all shadow-[0_0_10px_rgba(20,241,255,0.2)]"
                            aria-label="Remove image"
                        >
                            <X size={16} strokeWidth={3} />
                        </button>
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-4 text-center px-10 py-6">
                        {isDragging ? (
                            <ImageIcon size={44} className="text-cyan-400 animate-pulse drop-shadow-[0_0_8px_rgba(20,241,255,0.8)]" />
                        ) : (
                            <div className="w-14 h-14 bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[inset_0_0_10px_rgba(20,241,255,0.1)]">
                                <UploadCloud size={24} strokeWidth={3} />
                            </div>
                        )}
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
                                <span className="text-cyan-400 underline decoration-cyan-500/30 underline-offset-4">FETCH_ASSET</span> or Drop_Node
                            </p>
                            <p className="text-[10px] font-bold text-white/20 mt-2 uppercase tracking-widest leading-none flex items-center gap-2 justify-center">
                                <span className="w-1 h-1 bg-cyan-500 animate-pulse rounded-full" />
                                PROTOCOL_01 :: 10MB_LIMIT
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
                <p className="mt-4 text-[10px] font-black uppercase text-red-500 text-center tracking-widest border border-red-950 p-2 bg-red-950/20 shadow-[0_0_10px_rgba(255,0,0,0.1)]">
                    FATAL_ERROR :: {error}
                </p>
            )}
        </div>
    );
}
