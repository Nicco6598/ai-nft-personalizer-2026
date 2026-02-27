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
                    "relative flex flex-col items-center justify-center w-full min-h-[180px] rounded-xl transition-all duration-150 cursor-pointer select-none border-2 border-dashed",
                    isDragging
                        ? "border-[#b2ff00]/60 bg-[#b2ff00]/5 scale-[1.01]"
                        : "border-white/10 bg-[#0d1117] hover:border-white/20 hover:bg-white/3",
                    preview ? "cursor-default border-solid border-white/10" : "",
                ].join(" ")}
            >
                {preview ? (
                    <>
                        <Image
                            src={preview}
                            alt="Uploaded preview"
                            fill
                            className="object-cover rounded-xl p-0.5 opacity-90"
                        />
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                        <button
                            onClick={(e) => { e.stopPropagation(); clearImage(); }}
                            className="absolute top-3 right-3 z-10 w-7 h-7 bg-black/60 backdrop-blur-sm border border-white/15 rounded-full flex items-center justify-center text-white/60 hover:bg-red-500/80 hover:text-white hover:border-red-500/50 transition-all"
                            aria-label="Remove image"
                        >
                            <X size={13} strokeWidth={2.5} />
                        </button>
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-3 text-center px-8 py-8">
                        {isDragging ? (
                            <ImageIcon size={32} className="text-[#b2ff00]" />
                        ) : (
                            <div className="w-11 h-11 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-white/30">
                                <UploadCloud size={20} strokeWidth={1.5} />
                            </div>
                        )}
                        <div>
                            <p className="text-sm font-medium text-white/40">
                                <span className="text-[#b2ff00] font-semibold">Click to upload</span>{" "}
                                or drag & drop
                            </p>
                            <p className="text-[11px] text-white/20 mt-1">
                                PNG, JPG, WebP — max {MAX_SIZE_MB} MB
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
                <p className="mt-2.5 text-xs font-medium text-red-400 px-1">
                    {error}
                </p>
            )}
        </div>
    );
}
