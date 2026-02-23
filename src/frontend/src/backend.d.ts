import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface PlayerState {
    score: bigint;
    position: Position;
    health: bigint;
}
export interface Position {
    x: number;
    y: number;
    z: number;
}
export interface backendInterface {
    getAllPlayers(): Promise<Array<PlayerState>>;
    getPlayerState(): Promise<PlayerState>;
    spawnPlayer(initialPosition: Position): Promise<void>;
    takeDamage(amount: bigint): Promise<void>;
    updatePosition(newPosition: Position): Promise<void>;
}
