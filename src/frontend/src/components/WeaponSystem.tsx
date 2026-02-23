import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface WeaponSystemProps {
  isShooting: boolean;
}

export default function WeaponSystem({ isShooting }: WeaponSystemProps) {
  const weaponRef = useRef<THREE.Group>(null);
  const muzzleFlashRef = useRef<THREE.PointLight>(null);
  const shootTime = useRef(0);

  useFrame(({ camera, clock }) => {
    if (weaponRef.current) {
      // Position weapon relative to camera
      const offset = new THREE.Vector3(0.3, -0.3, -0.5);
      offset.applyQuaternion(camera.quaternion);
      weaponRef.current.position.copy(camera.position).add(offset);
      weaponRef.current.quaternion.copy(camera.quaternion);

      // Weapon bob animation
      const time = clock.getElapsedTime();
      weaponRef.current.position.y += Math.sin(time * 8) * 0.002;
      weaponRef.current.position.x += Math.cos(time * 8) * 0.002;
    }

    // Muzzle flash effect
    if (muzzleFlashRef.current) {
      const timeSinceShot = clock.getElapsedTime() - shootTime.current;
      if (timeSinceShot < 0.1) {
        muzzleFlashRef.current.intensity = 5 * (1 - timeSinceShot / 0.1);
      } else {
        muzzleFlashRef.current.intensity = 0;
      }
    }

    if (isShooting) {
      shootTime.current = clock.getElapsedTime();
    }
  });

  return (
    <group ref={weaponRef}>
      {/* Weapon Model */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.05, 0.05, 0.3]} />
        <meshStandardMaterial color="#4a5568" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, -0.03, -0.1]}>
        <boxGeometry args={[0.08, 0.06, 0.15]} />
        <meshStandardMaterial color="#2d3748" metalness={0.6} roughness={0.3} />
      </mesh>
      
      {/* Muzzle Flash */}
      <pointLight
        ref={muzzleFlashRef}
        position={[0, 0, -0.2]}
        color="#fbbf24"
        intensity={0}
        distance={5}
      />
    </group>
  );
}
