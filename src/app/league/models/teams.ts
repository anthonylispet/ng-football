export interface Team {
  id: number;
  name: string;
  player: PlayerCode;
}

export enum Player {
  A = 'Anthony',
  P = 'Pierre',
}

export type PlayerCode = keyof typeof Player;

export function getPlayerName(player: PlayerCode): string {
  return Player[player];
}
