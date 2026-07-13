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

  it('ne répète pas le même ordre de decks par blocs de cinq rencontres', () => {
    const anthonyDecks = Array.from({ length: 5 }, (_, index) => deck(`a${index + 1}`, 'A'));
    const pierreDecks = Array.from({ length: 5 }, (_, index) => deck(`p${index + 1}`, 'P'));
    const matches = generateTournamentMatches(anthonyDecks, pierreDecks, () => 0);
    const anthonyOrders: string[] = [];
    const pierreOrders: string[] = [];

    for (let index = 0; index < matches.length; index += 5) {
      const block = matches.slice(index, index + 5);
      anthonyOrders.push(block.map(match => match.team1.id).join(','));
      pierreOrders.push(block.map(match => match.team2.id).join(','));
    }

    expect(new Set(anthonyOrders).size).toBe(anthonyOrders.length);
    expect(new Set(pierreOrders).size).toBe(pierreOrders.length);
  });

  it('génère tous les duels lorsque la répétition immédiate est inévitable', () => {
    const matches = generateTournamentMatches(
      [deck('a1', 'A'), deck('a2', 'A')],
      [deck('p1', 'P'), deck('p2', 'P')],
      () => 0,
    );
    const repeatedTransitions = matches.slice(1).filter((match, index) =>
      match.team1.id === matches[index].team1.id || match.team2.id === matches[index].team2.id,
    );

    expect(matches).toHaveLength(4);
    expect(new Set(matches.map(match => `${match.team1.id}:${match.team2.id}`)).size).toBe(4);
    expect(repeatedTransitions).toHaveLength(1);
  });
});
