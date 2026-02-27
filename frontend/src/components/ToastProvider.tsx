"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import * as Toast from "@radix-ui/react-toast";
import { CheckCircleIcon, XCircleIcon, InfoIcon, XIcon } from "@phosphor-icons/react";

type ToastType = "success" | "error" | "info";

interface ToastMessage {
    id: string;
    type: ToastType;
    message: string;
}

interface ToastContextValue {
    success: (msg: string) => void;
    error: (msg: string) => void;
    info: (msg: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used inside ToastProvider");
    return ctx;
}

const ICONS: Record<ToastType, ReactNode> = {
    success: <CheckCircleIcon size={15} weight="fill" style={{ color: "#b2ff00" }} />,
    error:   <XCircleIcon size={15} weight="fill" style={{ color: "#f87171" }} />,
    info:    <InfoIcon size={15} weight="fill" style={{ color: "#14f1ff" }} />,
};

const ACCENT: Record<ToastType, string> = {
    success: "#b2ff00",
    error:   "#f87171",
    info:    "#14f1ff",
};

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const push = useCallback((type: ToastType, message: string) => {
        const id = crypto.randomUUID();
        setToasts((prev) => [...prev, { id, type, message }]);
    }, []);

    const remove = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const value: ToastContextValue = {
        success: (msg) => push("success", msg),
        error:   (msg) => push("error", msg),
        info:    (msg) => push("info", msg),
    };

    return (
        <ToastContext.Provider value={value}>
            <Toast.Provider swipeDirection="right" duration={3500}>
                {children}

                {toasts.map((t) => (
                    <Toast.Root
                        key={t.id}
                        onOpenChange={(open) => { if (!open) remove(t.id); }}
                        className="toast-root"
                        style={{
                            background: "#161b27",
                            border: `1px solid ${ACCENT[t.type]}22`,
                            borderRadius: 14,
                            padding: "12px 14px",
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
                            minWidth: 260,
                            maxWidth: 340,
                        }}
                    >
                        {ICONS[t.type]}
                        <Toast.Description
                            style={{
                                flex: 1,
                                fontSize: 12,
                                fontWeight: 500,
                                color: "rgba(255,255,255,0.75)",
                                lineHeight: 1.4,
                            }}
                        >
                            {t.message}
                        </Toast.Description>
                        <Toast.Close asChild>
                            <button
                                style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "rgba(255,255,255,0.25)",
                                    padding: 2,
                                    display: "flex",
                                    alignItems: "center",
                                }}
                                aria-label="Dismiss"
                            >
                                <XIcon size={12} weight="bold" />
                            </button>
                        </Toast.Close>
                    </Toast.Root>
                ))}

                <Toast.Viewport
                    style={{
                        position: "fixed",
                        bottom: 24,
                        right: 24,
                        zIndex: 9999,
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                        listStyle: "none",
                        margin: 0,
                        padding: 0,
                        outline: "none",
                    }}
                />
            </Toast.Provider>
        </ToastContext.Provider>
    );
}
