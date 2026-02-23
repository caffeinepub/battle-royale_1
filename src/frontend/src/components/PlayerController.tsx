import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { PointerLockControls } from '@react-three/drei';
import * as THREE from 'three';
import { useWeaponControls } from '../hooks/useWeaponControls';
import { useTouchControls } from '../hooks/useTouchControls';
import { useDeviceDetection } from '../hooks/useDeviceDetection';
import WeaponSystem from './WeaponSystem';

interface PlayerControllerProps {
  onPositionUpdate: (position: { x: number; y: number; z: number }) => void;
}

export default function PlayerController({ onPositionUpdate }: PlayerControllerProps) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const { isShooting, shoot } = useWeaponControls();
  const { isTouchDevice } = useDeviceDetection();
  const touchControls = useTouchControls(isTouchDevice);

  const moveSpeed = 0.15;
  const keys = useRef({
    w: false,
    a: false,
    s: false,
    d: false,
    space: false,
    shift: false
  });

  const cameraRotation = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key in keys.current) {
        keys.current[key as keyof typeof keys.current] = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key in keys.current) {
        keys.current[key as keyof typeof keys.current] = false;
      }
    };

    const handleClick = () => {
      if (!isTouchDevice && controlsRef.current?.isLocked) {
        shoot();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('click', handleClick);

    const interval = setInterval(() => {
      // Handle camera rotation for touch devices
      if (isTouchDevice && (touchControls.cameraRotation.x !== 0 || touchControls.cameraRotation.y !== 0)) {
        cameraRotation.current.x += touchControls.cameraRotation.x;
        cameraRotation.current.y += touchControls.cameraRotation.y;
        
        // Clamp vertical rotation
        cameraRotation.current.y = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, cameraRotation.current.y));
        
        camera.rotation.order = 'YXZ';
        camera.rotation.y = cameraRotation.current.x;
        camera.rotation.x = cameraRotation.current.y;
      }

      // Handle movement
      const isLocked = !isTouchDevice && controlsRef.current?.isLocked;
      const hasTouchMovement = isTouchDevice && (touchControls.movement.x !== 0 || touchControls.movement.y !== 0);
      
      if (isLocked || hasTouchMovement) {
        const direction = camera.getWorldDirection(new THREE.Vector3());
        const right = new THREE.Vector3();
        right.crossVectors(camera.up, direction).normalize();

        let moveX = 0;
        let moveZ = 0;

        // Keyboard controls (desktop)
        if (keys.current.w) {
          moveX -= direction.x * moveSpeed;
          moveZ -= direction.z * moveSpeed;
        }
        if (keys.current.s) {
          moveX += direction.x * moveSpeed;
          moveZ += direction.z * moveSpeed;
        }
        if (keys.current.a) {
          moveX -= right.x * moveSpeed;
          moveZ -= right.z * moveSpeed;
        }
        if (keys.current.d) {
          moveX += right.x * moveSpeed;
          moveZ += right.z * moveSpeed;
        }

        // Touch controls (mobile/tablet)
        if (isTouchDevice && hasTouchMovement) {
          // Forward/backward based on joystick Y
          moveX -= direction.x * touchControls.movement.y * moveSpeed;
          moveZ -= direction.z * touchControls.movement.y * moveSpeed;
          
          // Left/right based on joystick X
          moveX += right.x * touchControls.movement.x * moveSpeed;
          moveZ += right.z * touchControls.movement.x * moveSpeed;
        }

        if (moveX !== 0 || moveZ !== 0) {
          const newX = camera.position.x + moveX;
          const newZ = camera.position.z + moveZ;
          
          // Boundary check
          if (Math.abs(newX) < 95 && Math.abs(newZ) < 95) {
            camera.position.x = newX;
            camera.position.z = newZ;
            onPositionUpdate({ x: camera.position.x, y: 0, z: camera.position.z });
          }
        }
      }
    }, 16);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('click', handleClick);
      clearInterval(interval);
    };
  }, [camera, onPositionUpdate, shoot, isTouchDevice, touchControls]);

  // Handle touch shooting
  useEffect(() => {
    if (isTouchDevice && touchControls.isShooting) {
      shoot();
    }
  }, [isTouchDevice, touchControls.isShooting, shoot]);

  return (
    <>
      {!isTouchDevice && <PointerLockControls ref={controlsRef} />}
      <WeaponSystem isShooting={isShooting} />
    </>
  );
}
