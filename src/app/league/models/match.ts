import { Team } from './teams';

export interface Match {
  matchId: string;
  order: number;
  team1: Team;
  team2: Team;
  winner: Team | null;
}
