import { useState, useEffect, useRef, useCallback } from 'react';

interface TouchControlsState {
  movement: { x: number; y: number };
  cameraRotation: { x: number; y: number };
  isShooting: boolean;
}

export function useTouchControls(enabled: boolean) {
  const [state, setState] = useState<TouchControlsState>({
    movement: { x: 0, y: 0 },
    cameraRotation: { x: 0, y: 0 },
    isShooting: false
  });

  const joystickTouchId = useRef<number | null>(null);
  const cameraTouchId = useRef<number | null>(null);
  const lastCameraTouch = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!enabled) return;

    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];
      const x = touch.clientX;
      const y = touch.clientY;

      // Left side of screen = joystick (bottom 40%)
      if (x < window.innerWidth * 0.4 && y > window.innerHeight * 0.6) {
        if (joystickTouchId.current === null) {
          joystickTouchId.current = touch.identifier;
        }
      } 
      // Right side or upper area = camera control
      else {
        if (cameraTouchId.current === null) {
          cameraTouchId.current = touch.identifier;
          lastCameraTouch.current = { x, y };
        }
      }
    }
  }, [enabled]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!enabled) return;
    e.preventDefault();

    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];

      // Handle joystick movement
      if (touch.identifier === joystickTouchId.current) {
        const joystickCenter = {
          x: window.innerWidth * 0.15,
          y: window.innerHeight * 0.85
        };

        const deltaX = touch.clientX - joystickCenter.x;
        const deltaY = touch.clientY - joystickCenter.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const maxDistance = 60;

        const normalizedX = Math.max(-1, Math.min(1, deltaX / maxDistance));
        const normalizedY = Math.max(-1, Math.min(1, deltaY / maxDistance));

        setState(prev => ({
          ...prev,
          movement: { x: normalizedX, y: normalizedY }
        }));
      }

      // Handle camera rotation
      if (touch.identifier === cameraTouchId.current && lastCameraTouch.current) {
        const deltaX = touch.clientX - lastCameraTouch.current.x;
        const deltaY = touch.clientY - lastCameraTouch.current.y;

        setState(prev => ({
          ...prev,
          cameraRotation: {
            x: deltaX * 0.003,
            y: deltaY * 0.003
          }
        }));

        lastCameraTouch.current = { x: touch.clientX, y: touch.clientY };
      }
    }
  }, [enabled]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!enabled) return;

    for (let i = 0; i < e.changedTouches.length; i++) {
      const touch = e.changedTouches[i];

      if (touch.identifier === joystickTouchId.current) {
        joystickTouchId.current = null;
        setState(prev => ({
          ...prev,
          movement: { x: 0, y: 0 }
        }));
      }

      if (touch.identifier === cameraTouchId.current) {
        cameraTouchId.current = null;
        lastCameraTouch.current = null;
        setState(prev => ({
          ...prev,
          cameraRotation: { x: 0, y: 0 }
        }));
      }
    }
  }, [enabled]);

  const triggerShoot = useCallback(() => {
    setState(prev => ({ ...prev, isShooting: true }));
    setTimeout(() => {
      setState(prev => ({ ...prev, isShooting: false }));
    }, 100);
  }, []);

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [enabled, handleTouchStart, handleTouchMove, handleTouchEnd]);

  return {
    ...state,
    triggerShoot
  };
}
