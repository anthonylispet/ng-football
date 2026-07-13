export interface Team {
  id: string;
  name: string;
  player: PlayerCode;
  active: boolean;
  createdAt: number;
  updatedAt: number;
}

export enum Player {
  A = 'Anthony',
  P = 'Pierre',
}

export type PlayerCode = keyof typeof Player;

export function getPlayerName(player: PlayerCode): string {
  return Player[player];
}

export function getPlayerCodeFromEmail(email: string | null | undefined): PlayerCode | null {
  const normalizedEmail = email?.toLowerCase();

  if (normalizedEmail === 'anthony.lispet@gmail.com') {
    return 'A';
  }

  if (normalizedEmail === 'pierre.simon7041@gmail.com') {
    return 'P';
  }

  return null;
}
