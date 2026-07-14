import { PlayerCode, Team } from './teams';

export interface QuickMatch {
  id: string;
  createdAt: number;
  createdBy: PlayerCode;
  teamA: Team;
  teamP: Team;
  probabilityA: number;
  probabilityP: number;
  winner: Team | null;
}

export interface DeckSelectionStatistic {
  team: Team;
  selections: number;
  probability: number;
  lastSelectedAt: number | null;
}

export interface QuickMatchDraw {
  teamA: DeckSelectionStatistic;
  teamP: DeckSelectionStatistic;
}
