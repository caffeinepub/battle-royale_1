import { useState, useEffect } from 'react';

export function useDeviceDetection() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      // Check for touch support
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsTouchDevice(hasTouch);

      // Check screen size for mobile/tablet
      const width = window.innerWidth;
      const height = window.innerHeight;
      const minDimension = Math.min(width, height);
      const maxDimension = Math.max(width, height);

      // Mobile: smaller dimension < 768px
      setIsMobile(minDimension < 768);
      
      // Tablet: between 768px and 1024px
      setIsTablet(minDimension >= 768 && maxDimension < 1024);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    window.addEventListener('orientationchange', checkDevice);

    return () => {
      window.removeEventListener('resize', checkDevice);
      window.removeEventListener('orientationchange', checkDevice);
    };
  }, []);

  return {
    isTouchDevice,
    isMobile,
    isTablet,
    isDesktop: !isTouchDevice
  };
}
