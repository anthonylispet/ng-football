import { beforeEach, describe, expect, it } from 'vitest';
import { ScoreCounterComponent } from './score-counter.component';

describe('ScoreCounterComponent', () => {
  beforeEach(() => localStorage.clear());

  it('adds a round score to the current total', () => {
    const component = new ScoreCounterComponent();
    const player = component.state.players[0];
    player.draft = '35';

    component.submitScore(player);

    expect(player.total).toBe(35);
    expect(component.state.rounds[0].changes[0].difference).toBe(35);
  });

  it('can replace a total manually', () => {
    const component = new ScoreCounterComponent();
    const player = component.state.players[0];
    component.quickAdd(player, 50);
    component.setEntryMode('set');
    player.draft = '12';

    component.submitScore(player);

    expect(player.total).toBe(12);
    expect(component.state.rounds[0].changes[0].difference).toBe(-38);
  });

  it('supports adding players and undoing score changes', () => {
    const component = new ScoreCounterComponent();
    component.newPlayerName = 'Camille';
    component.addPlayer();
    expect(component.state.players.at(-1)?.name).toBe('Camille');

    component.quickAdd(component.state.players[3], 25);
    expect(component.state.players[3].total).toBe(25);

    component.undo();
    expect(component.state.players[3].total).toBe(0);
  });
});
