import { useEffect, useRef } from 'react';
import { useTouchControls } from '../hooks/useTouchControls';
import { useDeviceDetection } from '../hooks/useDeviceDetection';

interface TouchControlsProps {
  onShoot: () => void;
}

export default function TouchControls({ onShoot }: TouchControlsProps) {
  const { isTouchDevice } = useDeviceDetection();
  const { isShooting, triggerShoot } = useTouchControls(isTouchDevice);
  const shootButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isShooting) {
      onShoot();
    }
  }, [isShooting, onShoot]);

  if (!isTouchDevice) {
    return null;
  }

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Virtual Joystick */}
      <div className="absolute bottom-8 left-8 pointer-events-auto">
        <div className="relative w-32 h-32">
          {/* Joystick base */}
          <div className="absolute inset-0 rounded-full bg-[oklch(0.20_0.06_260/0.4)] border-2 border-[oklch(0.40_0.12_260/0.6)] backdrop-blur-sm" />
          {/* Joystick center indicator */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[oklch(0.75_0.20_260/0.8)] border-2 border-[oklch(0.85_0.22_260)]" />
          {/* Direction indicators */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-6 h-6 flex items-center justify-center text-[oklch(0.75_0.20_260)] text-xs font-bold">
            ▲
          </div>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 flex items-center justify-center text-[oklch(0.75_0.20_260)] text-xs font-bold">
            ▼
          </div>
          <div className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-[oklch(0.75_0.20_260)] text-xs font-bold">
            ◀
          </div>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-[oklch(0.75_0.20_260)] text-xs font-bold">
            ▶
          </div>
        </div>
      </div>

      {/* Shoot Button */}
      <div className="absolute bottom-8 right-8 pointer-events-auto">
        <button
          ref={shootButtonRef}
          onTouchStart={(e) => {
            e.preventDefault();
            triggerShoot();
          }}
          className="w-20 h-20 rounded-full bg-[oklch(0.65_0.25_10/0.8)] border-4 border-[oklch(0.75_0.22_30)] backdrop-blur-sm active:scale-95 transition-transform shadow-lg"
          style={{ boxShadow: '0 0 20px oklch(0.65 0.25 10 / 0.5)' }}
        >
          <div className="text-white font-bold text-sm">FIRE</div>
        </button>
      </div>

      {/* Camera control hint */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="bg-[oklch(0.15_0.06_260/0.7)] backdrop-blur-md border border-[oklch(0.3_0.1_260/0.5)] rounded-lg px-4 py-2 text-xs text-[oklch(0.75_0.20_260)] animate-pulse">
          Drag to look around
        </div>
      </div>
    </div>
  );
}
