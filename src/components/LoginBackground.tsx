'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import { useRef, useMemo, Suspense } from 'react';
import * as THREE from 'three';
import { motion } from 'framer-motion';

function FloatingItem({ position, color, speed, rotationSpeed, scale = 1, geometryType = 'sphere' }: any) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (!meshRef.current) return;
        const t = state.clock.getElapsedTime();
        meshRef.current.rotation.x = Math.sin(t * rotationSpeed) * 0.2;
        meshRef.current.rotation.y += rotationSpeed * 0.01;
        meshRef.current.position.y = position[1] + Math.sin(t * speed) * 0.3;
    });

    return (
        <Float speed={speed} rotationIntensity={0.5} floatIntensity={0.5}>
            <mesh ref={meshRef} position={position} scale={scale}>
                {geometryType === 'sphere' ? <icosahedronGeometry args={[1, 1]} /> :
                    geometryType === 'box' ? <boxGeometry args={[1, 1, 1]} /> :
                        <octahedronGeometry args={[1, 0]} />}

                <meshStandardMaterial
                    color={color}
                    roughness={0.2}
                    metalness={0.9}
                    emissive={color}
                    emissiveIntensity={0.3}
                    transparent
                    opacity={0.9}
                />
            </mesh>
        </Float>
    );
}

function FloatingParticles() {
    const count = 40;
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 15;
            const y = (Math.random() - 0.5) * 15;
            const z = (Math.random() - 0.5) * 8 - 3;
            const size = Math.random() * 0.15 + 0.05;
            const speed = Math.random() * 0.3 + 0.1;
            temp.push({ position: [x, y, z] as [number, number, number], size, speed });
        }
        return temp;
    }, []);

    return (
        <>
            {particles.map((p, i) => (
                <Float key={i} speed={p.speed} rotationIntensity={0.2} floatIntensity={0.3}>
                    <mesh position={p.position}>
                        <sphereGeometry args={[p.size, 8, 8]} />
                        <meshBasicMaterial color={i % 2 === 0 ? "#4ade80" : "#3b82f6"} transparent opacity={0.5} />
                    </mesh>
                </Float>
            ))}
        </>
    );
}

function Scene() {
    return (
        <>
            <ambientLight intensity={0.4} />
            <pointLight position={[10, 10, 10]} intensity={2} color="#4ade80" />
            <pointLight position={[-10, -10, 5]} intensity={1.5} color="#3b82f6" />
            <pointLight position={[0, -5, 5]} intensity={1} color="#a855f7" />

            {/* Main Floating Elements */}
            <FloatingItem position={[-3.5, 1.5, 0]} color="#4ade80" speed={1.2} rotationSpeed={0.8} scale={1.2} geometryType="sphere" />
            <FloatingItem position={[3.5, -1, -1]} color="#3b82f6" speed={1} rotationSpeed={0.6} scale={1.5} geometryType="octahedron" />
            <FloatingItem position={[-2, -2.5, -2]} color="#a855f7" speed={0.8} rotationSpeed={0.4} scale={0.8} geometryType="box" />
            <FloatingItem position={[2.5, 2.5, -1.5]} color="#22d3d1" speed={1.1} rotationSpeed={0.7} scale={1} geometryType="sphere" />

            {/* Sparkle particles */}
            <Sparkles count={80} scale={12} size={3} speed={0.3} opacity={0.6} color="#ffffff" />
            <FloatingParticles />
        </>
    );
}

export default function LoginBackground() {
    return (
        <>
            {/* Three.js Canvas - Full screen fixed position */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    zIndex: 0,
                    background: 'linear-gradient(135deg, #0a0a0a 0%, #111827 50%, #0a0a0a 100%)'
                }}
            >
                <Canvas
                    camera={{ position: [0, 0, 8], fov: 45 }}
                    dpr={[1, 2]}
                    style={{ width: '100%', height: '100%' }}
                >
                    <Suspense fallback={null}>
                        <Scene />
                    </Suspense>
                </Canvas>
            </div>

            {/* Gradient overlays for depth and text readability */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    background: 'radial-gradient(circle at 30% 20%, rgba(74, 222, 128, 0.08) 0%, transparent 50%)',
                    pointerEvents: 'none',
                    zIndex: 1
                }}
            />
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    background: 'radial-gradient(circle at 70% 80%, rgba(59, 130, 246, 0.08) 0%, transparent 50%)',
                    pointerEvents: 'none',
                    zIndex: 1
                }}
            />
        </>
    );
}
