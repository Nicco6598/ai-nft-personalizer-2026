"use client";

import { Suspense, useRef, useEffect, useState, Component, ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";

// ── Error boundary ────────────────────────────────────────────────────────────
class CanvasErrorBoundary extends Component<
    { children: ReactNode; onError: () => void },
    { hasError: boolean }
> {
    state = { hasError: false };
    static getDerivedStateFromError() { return { hasError: true }; }
    componentDidCatch(e: unknown) {
        console.error("[ModelViewer error]", e);
        this.props.onError();
    }
    render() {
        if (this.state.hasError) return null;
        return this.props.children;
    }
}

// ── Placeholder: semplice icosaedro senza dipendenze externe ──────────────────
function PlaceholderModel() {
    const meshRef = useRef<THREE.Mesh>(null);
    useFrame((_, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.5;
        }
    });
    return (
        <mesh ref={meshRef}>
            <icosahedronGeometry args={[1.4, 1]} />
            <meshStandardMaterial
                color="#14f1ff"
                emissive="#14f1ff"
                emissiveIntensity={0.15}
                metalness={0.8}
                roughness={0.3}
                wireframe={false}
            />
        </mesh>
    );
}

// ── GLTF loader ───────────────────────────────────────────────────────────────
function GltfModel({ url }: { url: string }) {
    const { scene } = useGLTF(url);

    useEffect(() => {
        if (scene) {
            const box = new THREE.Box3().setFromObject(scene);
            const center = new THREE.Vector3();
            box.getCenter(center);
            scene.position.sub(center);
        }
    }, [scene]);

    return <primitive object={scene} scale={2} />;
}

// ── Main component ────────────────────────────────────────────────────────────
interface ModelViewerProps {
    modelUrl?: string | null;
}

export default function ModelViewer({ modelUrl }: ModelViewerProps) {
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setHasError(false);
    }, [modelUrl]);

    if (hasError) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-[#0d1117] text-white/20 text-xs">
                Render error
            </div>
        );
    }

    return (
        <div className="w-full h-full bg-[#0d1117]">
            <CanvasErrorBoundary onError={() => setHasError(true)}>
                <Canvas
                    camera={{ position: [0, 0, 5], fov: 40 }}
                    gl={{ antialias: true, alpha: false }}
                    style={{ width: "100%", height: "100%", background: "#0d1117" }}
                    onCreated={(state) => {
                        state.gl.setClearColor(new THREE.Color("#0d1117"), 1);
                    }}
                >
                    {/* Luci semplici, nessun Environment HDR asincrono */}
                    <ambientLight intensity={0.8} />
                    <pointLight position={[5, 5, 5]} intensity={2} color="#14f1ff" />
                    <pointLight position={[-5, -3, -5]} intensity={1} color="#b2ff00" />
                    <directionalLight position={[0, 10, 5]} intensity={1} />

                    <Suspense fallback={<PlaceholderModel />}>
                        {modelUrl ? <GltfModel url={modelUrl} /> : <PlaceholderModel />}
                    </Suspense>

                    <OrbitControls
                        enableDamping
                        dampingFactor={0.1}
                        minDistance={1}
                        maxDistance={15}
                        rotateSpeed={0.8}
                        makeDefault
                    />

                    <gridHelper args={[20, 20, "#14f1ff18", "#14f1ff08"]} position={[0, -2, 0]} />
                </Canvas>
            </CanvasErrorBoundary>
        </div>
    );
}
