import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface NftMetadata {
    name: string;
    description: string;
    image: string;
    model_url: string;
    attributes: Array<{ trait_type: string; value: string }>;
}

export interface HistoryItem {
    id: string;
    metadata: NftMetadata;
    modelUrl: string;
    imageDataUrl: string | null;
    createdAt: number;
}

export type GenerationStatus = "idle" | "loading" | "done" | "error";

interface AppStore {
    // Generation state
    status: GenerationStatus;
    modelUrl: string | null;
    metadata: NftMetadata | null;
    errorMsg: string | null;
    progressStep: number; // 0–3

    // History (persisted)
    history: HistoryItem[];

    // Actions
    setStatus: (s: GenerationStatus) => void;
    setModelUrl: (url: string | null) => void;
    setMetadata: (m: NftMetadata | null) => void;
    setErrorMsg: (msg: string | null) => void;
    setProgressStep: (step: number) => void;
    resetGeneration: () => void;

    addToHistory: (item: Omit<HistoryItem, "id" | "createdAt">) => void;
    clearHistory: () => void;
    loadFromHistory: (item: HistoryItem) => void;
}

const MAX_HISTORY = 10;

export const useAppStore = create<AppStore>()(
    persist(
        (set) => ({
            status: "idle",
            modelUrl: null,
            metadata: null,
            errorMsg: null,
            progressStep: 0,
            history: [],

            setStatus: (status) => set({ status }),
            setModelUrl: (modelUrl) => set({ modelUrl }),
            setMetadata: (metadata) => set({ metadata }),
            setErrorMsg: (errorMsg) => set({ errorMsg }),
            setProgressStep: (progressStep) => set({ progressStep }),

            resetGeneration: () =>
                set({ status: "idle", modelUrl: null, metadata: null, errorMsg: null, progressStep: 0 }),

            addToHistory: (item) =>
                set((state) => {
                    const newItem: HistoryItem = {
                        ...item,
                        id: crypto.randomUUID(),
                        createdAt: Date.now(),
                    };
                    const updated = [newItem, ...state.history];
                    return { history: updated.slice(0, MAX_HISTORY) };
                }),

            clearHistory: () => set({ history: [] }),

            loadFromHistory: (item) =>
                set({
                    status: "done",
                    modelUrl: item.modelUrl,
                    metadata: item.metadata,
                    errorMsg: null,
                    progressStep: 4,
                }),
        }),
        {
            name: "nft-store",
            storage: createJSONStorage(() => localStorage),
            // Only persist history, not transient generation state
            partialize: (state) => ({ history: state.history }),
        }
    )
);
