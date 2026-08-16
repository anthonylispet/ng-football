import { Component, HostListener, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

interface CounterDefinition {
  name: string;
  icon: string;
}

interface CounterPlayer {
  name: string;
  life: number;
  counters: number[];
  theme: string;
}

interface CounterState {
  startingLife: number;
  players: CounterPlayer[];
  counters: CounterDefinition[];
}

@Component({
  standalone: true,
  selector: 'app-life-counter',
  imports: [RouterLink],
  templateUrl: './life-counter.component.html',
  styleUrls: ['./life-counter.component.scss'],
})
export class LifeCounterComponent implements OnInit {
  private readonly storageKey = 'magic-life-counter-v1';
  private readonly themes = ['ember', 'tide', 'grove', 'amethyst'];
  private history: CounterState[] = [];

  state: CounterState = this.createState(4, 40);
  settingsOpen = false;
  confirmReset = false;
  isFullscreen = false;

  ngOnInit(): void {
    this.restore();
    this.isFullscreen = !!document.fullscreenElement;
  }

  get canUndo(): boolean {
    return this.history.length > 0;
  }

  adjustLife(playerIndex: number, amount: number): void {
    this.snapshot();
    this.state.players[playerIndex].life += amount;
    this.persist();
    this.haptic();
  }

  adjustCounter(playerIndex: number, counterIndex: number, amount: number): void {
    const value = this.state.players[playerIndex].counters[counterIndex];
    if (value + amount < 0) return;
    this.snapshot();
    this.state.players[playerIndex].counters[counterIndex] = value + amount;
    this.persist();
    this.haptic();
  }

  setPlayerCount(count: number): void {
    if (count === this.state.players.length) return;
    this.snapshot();
    while (this.state.players.length < count) {
      const index = this.state.players.length;
      this.state.players.push(this.createPlayer(index, this.state.startingLife));
    }
    this.state.players = this.state.players.slice(0, count);
    this.persist();
  }

  setStartingLife(life: number): void {
    if (life === this.state.startingLife) return;
    this.snapshot();
    const oldStartingLife = this.state.startingLife;
    this.state.startingLife = life;
    this.state.players.forEach(player => {
      if (player.life === oldStartingLife) player.life = life;
    });
    this.persist();
  }

  updatePlayerName(index: number, event: Event): void {
    const name = (event.target as HTMLInputElement).value.trim();
    this.state.players[index].name = name || `Joueur ${index + 1}`;
    this.persist();
  }

  updateCounterName(index: number, event: Event): void {
    const name = (event.target as HTMLInputElement).value.trim();
    this.state.counters[index].name = name || `Compteur ${index + 1}`;
    this.persist();
  }

  undo(): void {
    const previous = this.history.pop();
    if (!previous) return;
    this.state = previous;
    this.persist();
  }

  requestReset(): void {
    this.confirmReset = true;
  }

  resetGame(): void {
    this.snapshot();
    this.state.players.forEach(player => {
      player.life = this.state.startingLife;
      player.counters = this.state.counters.map(() => 0);
    });
    this.confirmReset = false;
    this.settingsOpen = false;
    this.persist();
  }

  async toggleFullscreen(): Promise<void> {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch {
      // Fullscreen is optional and may be blocked by the browser.
    }
  }

  @HostListener('document:fullscreenchange')
  onFullscreenChange(): void {
    this.isFullscreen = !!document.fullscreenElement;
  }

  trackPlayer(index: number): number {
    return index;
  }

  private createState(playerCount: number, startingLife: number): CounterState {
    return {
      startingLife,
      players: Array.from({ length: playerCount }, (_, index) => this.createPlayer(index, startingLife)),
      counters: [
        { name: 'Poison', icon: '☠' },
        { name: 'Commandant', icon: '⚔' },
        { name: 'Énergie', icon: 'ϟ' },
      ],
    };
  }

  private createPlayer(index: number, startingLife: number): CounterPlayer {
    return {
      name: `Joueur ${index + 1}`,
      life: startingLife,
      counters: [0, 0, 0],
      theme: this.themes[index],
    };
  }

  private snapshot(): void {
    this.history.push(structuredClone(this.state));
    if (this.history.length > 30) this.history.shift();
  }

  private persist(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.state));
  }

  private restore(): void {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (!saved) return;
      const parsed = JSON.parse(saved) as CounterState;
      if (parsed.players?.length >= 2 && parsed.players.length <= 4 && parsed.counters?.length === 3) {
        this.state = parsed;
      }
    } catch {
      localStorage.removeItem(this.storageKey);
    }
  }

  private haptic(): void {
    navigator.vibrate?.(8);
  }
}
