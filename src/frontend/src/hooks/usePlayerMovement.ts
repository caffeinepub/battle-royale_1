import { useState, useCallback, useRef } from 'react';
import { useUpdatePosition } from './useQueries';
import type { Position } from '../backend';

export function usePlayerMovement(initialPosition: Position | null) {
  const [position, setPosition] = useState<Position | null>(initialPosition);
  const updateMutation = useUpdatePosition();
  const lastUpdateTime = useRef(0);
  const UPDATE_INTERVAL = 1000; // Update backend every 1 second

  const updatePlayerPosition = useCallback((newPosition: Position) => {
    setPosition(newPosition);

    const now = Date.now();
    if (now - lastUpdateTime.current > UPDATE_INTERVAL) {
      lastUpdateTime.current = now;
      updateMutation.mutate(newPosition);
    }
  }, [updateMutation]);

  return {
    position: position || initialPosition,
    updatePlayerPosition
  };
}
