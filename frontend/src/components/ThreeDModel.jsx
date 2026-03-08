import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, RoundedBox, MeshDistortMaterial, MeshWobbleMaterial, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

const MedicalCross = ({ position = [0, 0, 0], scale = 1, color = "#c23464" }) => {
    const groupRef = useRef();

    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        if (groupRef.current) {
            groupRef.current.rotation.y = time * 0.5;
            groupRef.current.rotation.x = Math.sin(time * 0.3) * 0.2;
        }
    });

    return (
        <group ref={groupRef} position={position} scale={scale}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
                {/* Horizontal part */}
                <RoundedBox args={[3, 0.8, 0.8]} radius={0.15} smoothness={4}>
                    <meshPhysicalMaterial
                        color={color}
                        metalness={0.9}
                        roughness={0.1}
                        clearcoat={1}
                        clearcoatRoughness={0.1}
                        transmission={0.2}
                        thickness={0.5}
                    />
                </RoundedBox>
                {/* Vertical part */}
                <RoundedBox args={[0.8, 3, 0.8]} radius={0.15} smoothness={4}>
                    <meshPhysicalMaterial
                        color={color}
                        metalness={0.9}
                        roughness={0.1}
                        clearcoat={1}
                        clearcoatRoughness={0.1}
                        transmission={0.2}
                        thickness={0.5}
                    />
                </RoundedBox>
            </Float>
        </group>
    );
};

const AbstractBubble = ({ position, size, color, speed, distort }) => {
    return (
        <Float speed={speed} rotationIntensity={2} floatIntensity={2} position={position}>
            <mesh>
                <sphereGeometry args={[size, 64, 64]} />
                <MeshDistortMaterial
                    color={color}
                    speed={speed}
                    distort={distort}
                    radius={size}
                    metalness={0.5}
                    roughness={0.2}
                    transparent
                    opacity={0.6}
                />
            </mesh>
        </Float>
    );
};

const Scene = ({ scale = 1 }) => {
    return (
        <group scale={scale}>
            <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={40} />
            <ambientLight intensity={0.8} />
            <directionalLight position={[0, 5, 5]} intensity={1} color="#ffffff" />
            <spotLight position={[10, 10, 10]} angle={0.2} penumbra={1} intensity={1} castShadow />
            <pointLight position={[-10, -5, 5]} intensity={0.5} color="#c23464" />

            <MedicalCross position={[0, 0, 0]} scale={1.1} />

            <AbstractBubble position={[-4, 3, -2]} size={0.5} color="#c23464" speed={1} distort={0.2} />
            <AbstractBubble position={[4, -3, -4]} size={0.7} color="#7600da" speed={0.8} distort={0.3} />
            <AbstractBubble position={[-5, -2, 1]} size={0.3} color="#da0067" speed={1.2} distort={0.1} />
            <AbstractBubble position={[3, 4, -3]} size={0.4} color="#7600da" speed={0.5} distort={0.2} />

            <ContactShadows position={[0, -4, 0]} opacity={0.3} scale={15} blur={2.5} far={4} />
        </group>
    );
};

const ThreeDModel = ({ scale = 1 }) => {
    return (
        <div style={{ width: '100%', height: '100%', minHeight: '600px' }}>
            <Canvas
                shadows
                dpr={[1, 2]}
                camera={{ position: [0, 0, 10], fov: 45 }}
                gl={{ alpha: true, antialias: true, stencil: false, depth: true }}
            >
                <Scene scale={scale} />
            </Canvas>
        </div>
    );
};

export default ThreeDModel;
