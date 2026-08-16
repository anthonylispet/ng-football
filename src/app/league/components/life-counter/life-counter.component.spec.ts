import { beforeEach, describe, expect, it } from 'vitest';
import { LifeCounterComponent } from './life-counter.component';

describe('LifeCounterComponent', () => {
  beforeEach(() => localStorage.clear());

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
});
