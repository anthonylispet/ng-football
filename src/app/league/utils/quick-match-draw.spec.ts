import { describe, expect, it } from 'vitest';
import { QuickMatch } from '../models/quick-match';
import { Team } from '../models/teams';
import {
  buildDeckSelectionStatistics,
  drawQuickMatch,
  selectWeightedDeck,
} from './quick-match-draw';

const anthonyDecks: Team[] = [
  { id: 'a1', name: 'Edgar', player: 'A', active: true, createdAt: 1, updatedAt: 1 },
  { id: 'a2', name: 'Kaalia', player: 'A', active: true, createdAt: 1, updatedAt: 1 },
];

const pierreDecks: Team[] = [
  { id: 'p1', name: 'Otrimi', player: 'P', active: true, createdAt: 1, updatedAt: 1 },
  { id: 'p2', name: 'Ixhel', player: 'P', active: true, createdAt: 1, updatedAt: 1 },
];

function quickMatch(id: string, teamA: Team, teamP: Team, createdAt: number): QuickMatch {
  return {
    id,
    createdAt,
    createdBy: 'A',
    teamA,
    teamP,
    probabilityA: .5,
    probabilityP: .5,
    winner: null,
  };
}

describe('quick match weighted draw', () => {
  it('gives equal probability to decks with the same history', () => {
    const statistics = buildDeckSelectionStatistics(anthonyDecks, [], 'A');

    expect(statistics.map(statistic => statistic.probability)).toEqual([.5, .5]);
  });

  it('gives an unselected deck more chance than an already selected deck', () => {
    const history = [
      quickMatch('m1', anthonyDecks[0], pierreDecks[0], 10),
      quickMatch('m2', anthonyDecks[0], pierreDecks[1], 20),
    ];
    const statistics = buildDeckSelectionStatistics(anthonyDecks, history, 'A');
    const edgar = statistics.find(statistic => statistic.team.id === 'a1')!;
    const kaalia = statistics.find(statistic => statistic.team.id === 'a2')!;

    expect(edgar.selections).toBe(2);
    expect(kaalia.selections).toBe(0);
    expect(kaalia.probability).toBeCloseTo(.75);
    expect(edgar.probability).toBeCloseTo(.25);
  });

  it('uses the calculated probability for the random selection', () => {
    const statistics = buildDeckSelectionStatistics(anthonyDecks, [], 'A');

    expect(selectWeightedDeck(statistics, .49).team.id).toBe('a1');
    expect(selectWeightedDeck(statistics, .5).team.id).toBe('a2');
  });

  it('draws one active deck for each player', () => {
    const draw = drawQuickMatch([...anthonyDecks, ...pierreDecks], [], () => .1);

    expect(draw.teamA.team.player).toBe('A');
    expect(draw.teamP.team.player).toBe('P');
  });

  it('ignores inactive decks', () => {
    const inactive = { ...anthonyDecks[0], active: false };
    const statistics = buildDeckSelectionStatistics([inactive, anthonyDecks[1]], [], 'A');

    expect(statistics.map(statistic => statistic.team.id)).toEqual(['a2']);
    expect(statistics[0].probability).toBe(1);
  });
});
