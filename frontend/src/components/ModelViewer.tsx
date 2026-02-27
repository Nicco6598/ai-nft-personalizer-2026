"use client";

import { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
    OrbitControls,
    Environment,
    useGLTF,
    MeshDistortMaterial,
} from "@react-three/drei";
import * as THREE from "three";

function PlaceholderModel() {
    const meshRef = useRef<THREE.Mesh>(null);
    useFrame((_, delta) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += delta * 0.45;
            meshRef.current.rotation.x += delta * 0.2;
        }
    });
    return (
        <mesh ref={meshRef}>
            <icosahedronGeometry args={[1.2, 2]} />
            <MeshDistortMaterial
                color="#14f1ff"
                metalness={1}
                roughness={0.5}
                distort={0.4}
                speed={3}
                envMapIntensity={0.5}
                wireframe={true}
            />
            <mesh scale={0.4}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshBasicMaterial color="#bcff00" />
            </mesh>
        </mesh>
    );
}

function GltfModel({ url }: { url: string }) {
    // help handle potential URL changes/unmounting
    const { scene } = useGLTF(url);

    // Auto-center and scale model
    useEffect(() => {
        if (scene) {
            const box = new THREE.Box3().setFromObject(scene);
            const center = new THREE.Vector3();
            box.getCenter(center);
            scene.position.sub(center); // center it
        }
    }, [scene]);

    return <primitive object={scene} scale={2} />;
}

interface ModelViewerProps {
    modelUrl?: string | null;
}

export default function ModelViewer({ modelUrl }: ModelViewerProps) {
    // Add internal state to force recovery from Suspense crashes
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        setHasError(false);
    }, [modelUrl]);

    if (hasError) {
        return (
            <div className="w-full h-full flex items-center justify-center bg-black text-cyan-500 font-black text-[10px] uppercase">
                [!] RENDER_ERROR_REBOOTING...
            </div>
        );
    }

    return (
        <div className="w-full h-full overflow-hidden bg-[#050505]">
            <Canvas
                shadows={false}
                camera={{ position: [0, 0, 5], fov: 40 }}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: "high-performance"
                }}
                style={{ background: "transparent", pointerEvents: "auto" }}
                onCreated={(state) => {
                    state.gl.setClearColor("#050505", 1);
                }}
            >
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={2} color="#14f1ff" />
                <pointLight position={[-10, -10, -10]} intensity={1.5} color="#bcff00" />

                <Environment preset="night" />

                <Suspense fallback={<PlaceholderModel />}>
                    {modelUrl ? (
                        <GltfModel url={modelUrl} />
                    ) : (
                        <PlaceholderModel />
                    )}
                </Suspense>

                <OrbitControls
                    enableDamping
                    dampingFactor={0.1}
                    minDistance={1}
                    maxDistance={15}
                    rotateSpeed={0.8}
                    makeDefault
                />

                <gridHelper args={[20, 20, "#14f1ff", "#14f1ff10"]} position={[0, -2, 0]} />
            </Canvas>
        </div>
    );
}
