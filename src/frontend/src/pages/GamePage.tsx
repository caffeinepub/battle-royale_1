import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import GameWorld from '../components/GameWorld';
import GameHUD from '../components/GameHUD';
import TouchControls from '../components/TouchControls';
import { useWeaponControls } from '../hooks/useWeaponControls';

export default function GamePage() {
  const { shoot } = useWeaponControls();

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[oklch(0.10_0.05_240)] touch-none">
      <Canvas
        shadows
        camera={{ position: [0, 1.6, 0], fov: 75 }}
        className="w-full h-full"
        dpr={[1, 2]}
        gl={{ antialias: true }}
      >
        <Suspense fallback={null}>
          <GameWorld />
        </Suspense>
      </Canvas>
      <GameHUD />
      <TouchControls onShoot={shoot} />
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-10">
        <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-[oklch(0.75_0.20_260)] rounded-full" style={{ boxShadow: '0 0 0 2px oklch(0.10 0.05 240)' }}>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-1 h-1 bg-[oklch(0.75_0.20_260)] rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
