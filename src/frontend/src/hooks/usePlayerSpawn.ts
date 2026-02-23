import { useEffect, useState } from 'react';
import { useSpawnPlayer } from './useQueries';
import type { Position } from '../backend';

export function usePlayerSpawn() {
  const [spawnPosition, setSpawnPosition] = useState<Position | null>(null);
  const spawnMutation = useSpawnPlayer();

  useEffect(() => {
    const spawnPoints: Position[] = [
      { x: 0, y: 0, z: 0 },
      { x: 20, y: 0, z: 20 },
      { x: -20, y: 0, z: 20 },
      { x: 20, y: 0, z: -20 },
      { x: -20, y: 0, z: -20 }
    ];

    const randomSpawn = spawnPoints[Math.floor(Math.random() * spawnPoints.length)];
    
    spawnMutation.mutate(randomSpawn, {
      onSuccess: () => {
        setSpawnPosition(randomSpawn);
      },
      onError: (error: any) => {
        // If player already spawned, just set a default position
        if (error.message?.includes('already spawned')) {
          setSpawnPosition(randomSpawn);
        }
      }
    });
  }, []);

  return {
    spawnPosition,
    isSpawning: spawnMutation.isPending || !spawnPosition
  };
}
