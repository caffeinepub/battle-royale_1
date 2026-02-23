import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { PlayerState, Position } from '../backend';

export function usePlayerState() {
  const { actor, isFetching } = useActor();

  return useQuery<PlayerState>({
    queryKey: ['playerState'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.getPlayerState();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 2000,
    retry: false
  });
}

export function useSpawnPlayer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (initialPosition: Position) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.spawnPlayer(initialPosition);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playerState'] });
    }
  });
}

export function useUpdatePosition() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (newPosition: Position) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updatePosition(newPosition);
    }
  });
}

export function useTakeDamage() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (amount: bigint) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.takeDamage(amount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['playerState'] });
    }
  });
}

export function useAllPlayers() {
  const { actor, isFetching } = useActor();

  return useQuery<PlayerState[]>({
    queryKey: ['allPlayers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPlayers();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 3000
  });
}
