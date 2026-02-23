import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Sky, Stars } from '@react-three/drei';
import * as THREE from 'three';
import PlayerController from './PlayerController';
import { usePlayerSpawn } from '../hooks/usePlayerSpawn';
import { usePlayerMovement } from '../hooks/usePlayerMovement';

export default function GameWorld() {
  const { camera } = useThree();
  const { spawnPosition, isSpawning } = usePlayerSpawn();
  const { position, updatePlayerPosition } = usePlayerMovement(spawnPosition);

  useEffect(() => {
    if (spawnPosition) {
      camera.position.set(spawnPosition.x, spawnPosition.y + 1.6, spawnPosition.z);
    }
  }, [spawnPosition, camera]);

  useFrame(() => {
    if (position) {
      camera.position.x = position.x;
      camera.position.y = position.y + 1.6;
      camera.position.z = position.z;
    }
  });

  if (isSpawning) {
    return null;
  }

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[50, 50, 25]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={100}
        shadow-camera-left={-50}
        shadow-camera-right={50}
        shadow-camera-top={50}
        shadow-camera-bottom={-50}
      />
      <pointLight position={[0, 10, 0]} intensity={0.5} color="#a78bfa" />

      {/* Sky */}
      <Sky
        distance={450000}
        sunPosition={[50, 20, 25]}
        inclination={0.6}
        azimuth={0.25}
      />
      <Stars radius={300} depth={60} count={5000} factor={7} saturation={0} fade speed={1} />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[200, 200, 50, 50]} />
        <meshStandardMaterial 
          color="#1a1a2e"
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* Spawn Points Markers */}
      <SpawnMarker position={[0, 0.1, 0]} />
      <SpawnMarker position={[20, 0.1, 20]} />
      <SpawnMarker position={[-20, 0.1, 20]} />
      <SpawnMarker position={[20, 0.1, -20]} />
      <SpawnMarker position={[-20, 0.1, -20]} />

      {/* Environment Objects */}
      <Cover position={[10, 1, 10]} />
      <Cover position={[-15, 1, 8]} />
      <Cover position={[8, 1, -12]} />
      <Cover position={[-10, 1, -15]} />
      <Cover position={[0, 1, 20]} />

      <PlayerController onPositionUpdate={updatePlayerPosition} />
    </>
  );
}

function SpawnMarker({ position }: { position: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.5;
      meshRef.current.position.y = position[1] + Math.sin(clock.getElapsedTime() * 2) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <cylinderGeometry args={[1.5, 1.5, 0.1, 32]} />
      <meshStandardMaterial 
        color="#8b5cf6"
        emissive="#8b5cf6"
        emissiveIntensity={0.5}
        transparent
        opacity={0.6}
      />
    </mesh>
  );
}

function Cover({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial 
        color="#2d3748"
        roughness={0.7}
        metalness={0.3}
      />
    </mesh>
  );
}
