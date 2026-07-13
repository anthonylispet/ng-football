import { describe, expect, it } from 'vitest';
import { LeaguesService } from './leagues.service';
import { TeamsService } from './teams.service';

const legacyRoot = {
  teams: [
    { id: 0, name: 'Edgar Markov', player: 'A' },
    { id: 1, name: 'Otrimi', player: 'P' },
  ],
  matchs: [
    {
      matchId: 0,
      team1: { id: 0, name: 'Edgar Markov', player: 'A' },
      team2: { id: 1, name: 'Otrimi', player: 'P' },
      winner: null,
    },
  ],
};

describe('compatibilité avec les anciennes données Firebase', () => {
  it('reconstruit les decks depuis teams', () => {
    const service = Object.create(TeamsService.prototype) as TeamsService;
    const teams = (service as unknown as { normalizeRoot(value: unknown): unknown[] }).normalizeRoot(legacyRoot);

    expect(teams).toHaveLength(2);
    expect(teams).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'legacy-0', name: 'Edgar Markov' }),
      expect.objectContaining({ id: 'legacy-1', name: 'Otrimi' }),
    ]));
  });

  it('reconstruit une ligue sélectionnable avec ses rencontres', () => {
    const service = Object.create(LeaguesService.prototype) as LeaguesService;
    const leagues = (service as unknown as { normalizeRoot(value: unknown): Array<{ id: string; matches: unknown[] }> }).normalizeRoot(legacyRoot);

    expect(leagues).toHaveLength(1);
    expect(leagues[0].id).toBe('legacy-season-1');
    expect(leagues[0].matches).toHaveLength(1);
  });
});
