'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

function Particle({ position, color, scale }: { position: [number, number, number], color: string, scale: number }) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (!meshRef.current) return;
        meshRef.current.rotation.x += 0.01 * scale;
        meshRef.current.rotation.y += 0.015 * scale;
        // Gentle floating movement is handled by <Float> wrapper
    });

    return (
        <Float speed={2} rotationIntensity={2} floatIntensity={1}>
            <mesh ref={meshRef} position={position} scale={scale}>
                <icosahedronGeometry args={[1, 0]} />
                <meshStandardMaterial
                    color={color}
                    roughness={0.1}
                    metalness={0.1}
                    emissive={color}
                    emissiveIntensity={0.5}
                    transparent
                    opacity={0.4}
                />
            </mesh>
        </Float>
    );
}

function FloatingScene() {
    // Reverted to abstract particles as per user request to "remove" the fast food items
    const particles = useMemo(() => {
        const count = 50;
        const items = [];
        const colors = ['#4ade80', '#60a5fa', '#facc15', '#f87171']; // Green, Blue, Yellow, Red

        for (let i = 0; i < count; i++) {
            // Spread particles wider so they are visible on edges
            const x = (Math.random() - 0.5) * 25;
            const y = (Math.random() - 0.5) * 25;
            const z = (Math.random() - 0.5) * 10 - 2; // Closer to camera
            const scale = Math.random() * 0.6 + 0.3; // Slightly larger
            const color = colors[Math.floor(Math.random() * colors.length)];
            items.push({ position: [x, y, z] as [number, number, number], scale, color, key: i });
        }
        return items;
    }, []);

    return (
        <group>
            {particles.map((p) => (
                <Particle key={p.key} position={p.position} scale={p.scale} color={p.color} />
            ))}
            <Environment preset="city" />
        </group>
    );
}

export default function ThreeBackground() {
    return (
        <div className="absolute inset-0 z-0 bg-transparent overflow-hidden pointer-events-none">
            {/* Dark gradient background for the page */}
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 -z-10" />

            <Canvas dpr={[1, 2]}>
                <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={50} />
                <ambientLight intensity={1.0} />
                <pointLight position={[10, 10, 10]} intensity={2.0} />
                <FloatingScene />
            </Canvas>
        </div>
    );
}
