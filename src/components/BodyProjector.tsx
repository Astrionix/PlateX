
'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, PerspectiveCamera, Sparkles } from '@react-three/drei';
import * as THREE from 'three';

// Procedural Mannequin
function Mannequin({ weightStatus, timeOffset }: { weightStatus: number, timeOffset: number }) {
    // weightStatus: 0 (Goal) to 1 (Start). 1 = heavier.
    // We want to visualize the transformation.

    // Base scale factors
    const girth = 1 + (weightStatus * 0.4); // 0.4 variance
    const color = new THREE.Color().setHSL(0.6 - (weightStatus * 0.2), 0.8, 0.5); // Blue to Greenish

    const group = useRef<THREE.Group>(null);

    useFrame((state) => {
        if (group.current) {
            group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;
        }
    });

    return (
        <group ref={group} position={[0, -2, 0]}>
            {/* Head */}
            <mesh position={[0, 4.2, 0]}>
                <sphereGeometry args={[0.35, 32, 32]} />
                <meshStandardMaterial color={color} opacity={0.8} transparent roughness={0.2} metalness={0.8} />
            </mesh>

            {/* Neck */}
            <mesh position={[0, 3.8, 0]}>
                <cylinderGeometry args={[0.12, 0.15, 0.3, 16]} />
                <meshStandardMaterial color={color} opacity={0.8} transparent roughness={0.2} metalness={0.8} />
            </mesh>

            {/* Torso - The main part that changes */}
            <mesh position={[0, 2.8, 0]}>
                {/* Top width wider (chest), bottom width narrower (waist) */}
                <cylinderGeometry args={[0.5 * girth, 0.45 * girth, 1.8, 32]} />
                <meshStandardMaterial color={color} opacity={0.6} transparent wireframe={false} roughness={0.2} metalness={0.8} />
            </mesh>
            {/* Wireframe overlay for "Hologram" effect */}
            <mesh position={[0, 2.8, 0]} scale={[1.02, 1.02, 1.02]}>
                <cylinderGeometry args={[0.5 * girth, 0.45 * girth, 1.8, 32]} />
                <meshBasicMaterial color="#4ade80" wireframe opacity={0.1} transparent />
            </mesh>

            {/* Hips */}
            <mesh position={[0, 1.8, 0]}>
                <cylinderGeometry args={[0.42 * girth, 0.45 * girth, 0.6, 32]} />
                <meshStandardMaterial color={color} opacity={0.8} transparent roughness={0.2} metalness={0.8} />
            </mesh>

            {/* Legs (Left/Right) */}
            <mesh position={[-0.25, 0.8, 0]}>
                <cylinderGeometry args={[0.15 * girth, 0.1, 1.6, 16]} />
                <meshStandardMaterial color={color} opacity={0.8} transparent roughness={0.2} metalness={0.8} />
            </mesh>
            <mesh position={[0.25, 0.8, 0]}>
                <cylinderGeometry args={[0.15 * girth, 0.1, 1.6, 16]} />
                <meshStandardMaterial color={color} opacity={0.8} transparent roughness={0.2} metalness={0.8} />
            </mesh>

            {/* Arms (Left/Right) */}
            <mesh position={[-0.65 - (girth * 0.1), 2.8, 0]} rotation={[0, 0, 0.2]}>
                <cylinderGeometry args={[0.12, 0.1, 1.6, 16]} />
                <meshStandardMaterial color={color} opacity={0.8} transparent roughness={0.2} metalness={0.8} />
            </mesh>
            <mesh position={[0.65 + (girth * 0.1), 2.8, 0]} rotation={[0, 0, -0.2]}>
                <cylinderGeometry args={[0.12, 0.1, 1.6, 16]} />
                <meshStandardMaterial color={color} opacity={0.8} transparent roughness={0.2} metalness={0.8} />
            </mesh>
        </group>
    );
}

export default function BodyProjector({ currentWeight, goalWeight, months }: { currentWeight: number, goalWeight: number, months: number }) {
    // Calculate interpolation
    // Assumes 12 months to reach goal for simple visualization
    const progress = Math.min(months / 12, 1);
    const weightStatus = 1 - progress; // 1 = Start, 0 = Goal

    return (
        <div className="w-full h-full relative">
            <Canvas>
                <PerspectiveCamera makeDefault position={[0, 1, 6]} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <pointLight position={[-10, -10, -10]} color="green" intensity={0.5} />

                <Mannequin weightStatus={weightStatus} timeOffset={months} />

                <Sparkles count={50} scale={5} size={2} speed={0.4} opacity={0.2} color="#4ade80" />
                <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 2} />
            </Canvas>

            {/* Overlay Data */}
            <div className="absolute top-4 left-4 pointer-events-none">
                <div className="bg-black/50 backdrop-blur-md p-4 rounded-xl border border-green-500/30">
                    <h4 className="text-green-400 text-xs font-bold font-mono tracking-widest mb-1">PROJECTED WEIGHT</h4>
                    <p className="text-3xl font-bold text-white">
                        {Math.round(currentWeight - ((currentWeight - goalWeight) * progress))} kg
                    </p>
                </div>
            </div>
        </div>
    );
}
