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

  it('requires confirmation before removing a player', () => {
    const component = new ScoreCounterComponent();
    const player = component.state.players[0];

    component.requestPlayerRemoval(player);
    expect(component.pendingRemovalId).toBe(player.id);
    expect(component.state.players).toContain(player);

    component.cancelPlayerRemoval();
    expect(component.pendingRemovalId).toBeNull();
    expect(component.state.players).toContain(player);

    component.requestPlayerRemoval(player);
    component.removePlayer(player);
    expect(component.pendingRemovalId).toBeNull();
    expect(component.state.players).not.toContain(player);
  });

  it('shows each total a player passed through', () => {
    const component = new ScoreCounterComponent();
    const player = component.state.players[0];

    component.quickAdd(player, 25);
    component.quickAdd(player, 50);
    component.setEntryMode('set');
    player.draft = '40';
    component.submitScore(player);

    expect(component.scorePath(player)).toEqual([0, 25, 75, 40]);
  });

  it('sorts players by highest, lowest or original player order', () => {
    const component = new ScoreCounterComponent();
    component.quickAdd(component.state.players[0], 20);
    component.quickAdd(component.state.players[1], 50);
    component.quickAdd(component.state.players[2], 10);

    component.setSortMode('highest');
    expect(component.displayedPlayers.map(player => player.total)).toEqual([50, 20, 10]);

    component.setSortMode('lowest');
    expect(component.displayedPlayers.map(player => player.total)).toEqual([10, 20, 50]);

    component.setSortMode('players');
    expect(component.displayedPlayers.map(player => player.total)).toEqual([20, 50, 10]);
  });

  it('opens and closes one player evolution independently', () => {
    const component = new ScoreCounterComponent();
    const first = component.state.players[0];
    const second = component.state.players[1];

    component.toggleEvolution(first);
    expect(component.isEvolutionOpen(first)).toBe(true);
    expect(component.isEvolutionOpen(second)).toBe(false);

    component.toggleEvolution(first);
    expect(component.isEvolutionOpen(first)).toBe(false);
  });
});
