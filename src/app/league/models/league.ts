import { Match } from './match';
import { PlayerCode, Team } from './teams';

export type LeagueStatus = 'draft' | 'active' | 'closed';

export interface League {
  id: string;
  name: string;
  status: LeagueStatus;
  createdAt: number;
  createdBy: PlayerCode;
  startedAt: number | null;
  closedAt: number | null;
  selectedDeckIds: Record<PlayerCode, string[]>;
  deckSnapshots: Record<string, Team>;
  matches: Match[];
}

export interface LeagueCreationResult {
  id: string;
  league: League;
}
