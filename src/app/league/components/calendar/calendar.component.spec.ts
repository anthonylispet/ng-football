import { ChangeDetectorRef } from '@angular/core';
import { describe, expect, it } from 'vitest';
import { Match } from '../../models/match';
import { CalendarComponent } from './calendar.component';

const matches: Match[] = [
  {
    matchId: 'match-1',
    order: 0,
    team1: { id: 'epee', name: 'L’Épée des ancêtres', player: 'A', active: true, createdAt: 1, updatedAt: 1 },
    team2: { id: 'otrimi', name: 'Otrimi', player: 'P', active: true, createdAt: 1, updatedAt: 1 },
    winner: null,
  },
  {
    matchId: 'match-2',
    order: 1,
    team1: { id: 'edgar', name: 'Edgar Markov', player: 'A', active: true, createdAt: 1, updatedAt: 1 },
    team2: { id: 'ixhel', name: 'Ixhel', player: 'P', active: true, createdAt: 1, updatedAt: 1 },
    winner: null,
  },
];

function createComponent(): CalendarComponent {
  return new CalendarComponent(
    {} as never,
    {} as never,
    {} as never,
    { markForCheck: () => undefined } as unknown as ChangeDetectorRef,
  );
}

describe('CalendarComponent search', () => {
  it('filters matches using either team name', () => {
    const component = createComponent();
    component.matches = matches;
    component.searchTerm = 'OTRIMI';

    expect(component.filteredMatches.map(match => match.matchId)).toEqual(['match-1']);
  });

  it('ignores accents when filtering', () => {
    const component = createComponent();
    component.matches = matches;
    component.searchTerm = 'epee';

    expect(component.filteredMatches.map(match => match.matchId)).toEqual(['match-1']);
  });

  it('combines search and match status filters', () => {
    const component = createComponent();
    component.matches = [{ ...matches[0], winner: matches[0].team1 }, matches[1]];
    component.filter = 'pending';
    component.searchTerm = 'otrimi';

    expect(component.filteredMatches).toEqual([]);
  });
});
