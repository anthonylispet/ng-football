import { describe, expect, it } from 'vitest';
import { Team } from '../models/teams';
import { generateTournamentMatches } from './schedule-generator';

function deck(id: string, player: 'A' | 'P'): Team {
  return { id, player, name: id, active: true, createdAt: 0, updatedAt: 0 };
}

describe('generateTournamentMatches', () => {
  it('génère chaque duel une seule fois', () => {
    const matches = generateTournamentMatches(
      [deck('a1', 'A'), deck('a2', 'A'), deck('a3', 'A')],
      [deck('p1', 'P'), deck('p2', 'P'), deck('p3', 'P')],
      () => 0,
    );

    expect(matches).toHaveLength(9);
    expect(new Set(matches.map(match => `${match.team1.id}:${match.team2.id}`)).size).toBe(9);
  });

  it('évite un même deck deux fois de suite lorsqu’une alternative existe', () => {
    const matches = generateTournamentMatches(
      [deck('a1', 'A'), deck('a2', 'A'), deck('a3', 'A')],
      [deck('p1', 'P'), deck('p2', 'P'), deck('p3', 'P')],
      () => 0,
    );

    for (let index = 1; index < matches.length; index++) {
      expect(matches[index].team1.id).not.toBe(matches[index - 1].team1.id);
      expect(matches[index].team2.id).not.toBe(matches[index - 1].team2.id);
    }
  });
});
