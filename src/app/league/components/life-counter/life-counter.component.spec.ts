import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LifeCounterComponent } from './life-counter.component';

describe('LifeCounterComponent', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => vi.useRealTimers());

  it('adjusts life and can undo the last change', () => {
    const component = new LifeCounterComponent();

    component.adjustLife(0, -1);
    expect(component.state.players[0].life).toBe(39);

    component.undo();
    expect(component.state.players[0].life).toBe(40);
  });

  it('keeps secondary counters at zero or above', () => {
    const component = new LifeCounterComponent();

    component.adjustCounter(0, 0, -1);
    expect(component.state.players[0].counters[0]).toBe(0);

    component.adjustCounter(0, 0, 1);
    expect(component.state.players[0].counters[0]).toBe(1);
  });

  it('supports two to four players without losing existing values', () => {
    const component = new LifeCounterComponent();
    component.adjustLife(0, -5);

    component.setPlayerCount(2);
    expect(component.state.players).toHaveLength(2);
    expect(component.state.players[0].life).toBe(35);

    component.setPlayerCount(4);
    expect(component.state.players).toHaveLength(4);
    expect(component.state.players[2].life).toBe(40);
  });

  it('animates the draw and stores the selected starting player', async () => {
    vi.useFakeTimers();
    const component = new LifeCounterComponent();

    const draw = component.chooseStartingPlayer(2);
    expect(component.isChoosingStarter).toBe(true);
    await vi.advanceTimersByTimeAsync(3000);
    await draw;

    expect(component.isChoosingStarter).toBe(false);
    expect(component.highlightedStarterIndex).toBe(2);
    expect(component.state.startingPlayerIndex).toBe(2);
    expect(component.starterResultVisible).toBe(true);

    await vi.advanceTimersByTimeAsync(5000);
    expect(component.highlightedStarterIndex).toBeNull();
    expect(component.starterResultVisible).toBe(false);
  });

  it('offers a new draw after restarting the game', async () => {
    vi.useFakeTimers();
    const component = new LifeCounterComponent();
    const draw = component.chooseStartingPlayer(1);
    await vi.advanceTimersByTimeAsync(3000);
    await draw;

    component.resetGame();

    expect(component.state.startingPlayerIndex).toBeNull();
    expect(component.highlightedStarterIndex).toBeNull();
  });

  it('shows a defeat at zero life and can restore the player to one', () => {
    const component = new LifeCounterComponent();
    component.state.players[0].life = 0;

    component.revivePlayer(0);

    expect(component.state.players[0].life).toBe(1);
  });
});
