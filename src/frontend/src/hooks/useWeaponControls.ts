import { useState, useCallback, useRef } from 'react';

export function useWeaponControls() {
  const [isShooting, setIsShooting] = useState(false);
  const lastShotTime = useRef(0);
  const FIRE_RATE = 200; // milliseconds between shots

  const shoot = useCallback(() => {
    const now = Date.now();
    if (now - lastShotTime.current > FIRE_RATE) {
      lastShotTime.current = now;
      setIsShooting(true);
      
      // Play shoot sound effect (if available)
      // Add visual feedback
      
      setTimeout(() => {
        setIsShooting(false);
      }, 100);
    }
  }, []);

  return {
    isShooting,
    shoot
  };
}
