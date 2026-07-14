import {
  DeckSelectionStatistic,
  QuickMatch,
  QuickMatchDraw,
} from '../models/quick-match';
import { PlayerCode, Team } from '../models/teams';

export function buildDeckSelectionStatistics(
  teams: Team[],
  history: QuickMatch[],
  player: PlayerCode,
): DeckSelectionStatistic[] {
  const appearances = new Map<string, { selections: number; lastSelectedAt: number }>();

  for (const match of history) {
    const selectedTeam = player === 'A' ? match.teamA : match.teamP;
    const current = appearances.get(selectedTeam.id);
    appearances.set(selectedTeam.id, {
      selections: (current?.selections ?? 0) + 1,
      lastSelectedAt: Math.max(current?.lastSelectedAt ?? 0, match.createdAt),
    });
  }

  const activeTeams = teams.filter(team => team.active && team.player === player);
  const weights = activeTeams.map(team => 1 / ((appearances.get(team.id)?.selections ?? 0) + 1));
  const totalWeight = weights.reduce((total, weight) => total + weight, 0);

  return activeTeams
    .map((team, index) => ({
      team,
      selections: appearances.get(team.id)?.selections ?? 0,
      probability: totalWeight ? weights[index] / totalWeight : 0,
      lastSelectedAt: appearances.get(team.id)?.lastSelectedAt ?? null,
    }))
    .sort((left, right) => left.team.name.localeCompare(right.team.name, 'fr'));
}

export function drawQuickMatch(
  teams: Team[],
  history: QuickMatch[],
  random: () => number = Math.random,
): QuickMatchDraw {
  const anthonyStatistics = buildDeckSelectionStatistics(teams, history, 'A');
  const pierreStatistics = buildDeckSelectionStatistics(teams, history, 'P');

  if (!anthonyStatistics.length || !pierreStatistics.length) {
    throw new Error('MISSING_ACTIVE_DECK');
  }

  return {
    teamA: selectWeightedDeck(anthonyStatistics, random()),
    teamP: selectWeightedDeck(pierreStatistics, random()),
  };
}

export function selectWeightedDeck(
  statistics: DeckSelectionStatistic[],
  randomValue: number,
): DeckSelectionStatistic {
  if (!statistics.length) {
    throw new Error('MISSING_ACTIVE_DECK');
  }

  const normalizedRandom = Math.min(Math.max(randomValue, 0), 1 - Number.EPSILON);
  let cumulativeProbability = 0;

  for (const statistic of statistics) {
    cumulativeProbability += statistic.probability;
    if (normalizedRandom < cumulativeProbability) {
      return statistic;
    }
  }

  return statistics[statistics.length - 1];
}
