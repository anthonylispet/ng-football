import { ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit } from '@angular/core';
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
  startingPlayerIndex: number | null;
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
export class LifeCounterComponent implements OnInit, OnDestroy {
  private readonly storageKey = 'magic-life-counter-v1';
  private readonly themes = ['ember', 'tide', 'grove', 'amethyst'];
  private history: CounterState[] = [];
  private destroyed = false;
  private starterResultTimer?: ReturnType<typeof setTimeout>;

  state: CounterState = this.createState(4, 40);
  settingsOpen = false;
  confirmReset = false;
  isFullscreen = false;
  isChoosingStarter = false;
  highlightedStarterIndex: number | null = null;
  starterResultVisible = false;

  constructor(private readonly changeDetector?: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.restore();
    this.isFullscreen = !!document.fullscreenElement;
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    if (this.starterResultTimer) clearTimeout(this.starterResultTimer);
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
    this.state.startingPlayerIndex = null;
    this.highlightedStarterIndex = null;
    this.hideStarterResult();
    this.persist();
  }

  async chooseStartingPlayer(forcedIndex?: number): Promise<void> {
    if (this.isChoosingStarter || this.state.players.length === 0) return;

    this.settingsOpen = false;
    this.isChoosingStarter = true;
    this.hideStarterResult();
    this.state.startingPlayerIndex = null;
    const playerCount = this.state.players.length;
    const randomIndex = Math.floor(Math.random() * playerCount);
    const targetIndex = forcedIndex === undefined ? randomIndex : Math.max(0, Math.min(playerCount - 1, forcedIndex));
    const steps = playerCount * 3 + targetIndex + 1;

    for (let step = 0; step < steps; step += 1) {
      if (this.destroyed) return;
      this.highlightedStarterIndex = step % playerCount;
      this.changeDetector?.detectChanges();
      this.vibrate(step > steps - 4 ? 16 : 7);
      const progress = step / Math.max(1, steps - 1);
      await this.delay(70 + Math.round(progress * progress * 190));
    }

    if (this.destroyed) return;
    this.highlightedStarterIndex = targetIndex;
    this.state.startingPlayerIndex = targetIndex;
    this.isChoosingStarter = false;
    this.starterResultVisible = true;
    this.changeDetector?.detectChanges();
    this.persist();
    this.vibrate([40, 35, 90]);
    this.starterResultTimer = setTimeout(() => {
      this.starterResultVisible = false;
      this.highlightedStarterIndex = null;
      this.changeDetector?.detectChanges();
    }, 5000);
  }

  revivePlayer(playerIndex: number): void {
    if (this.state.players[playerIndex].life > 0) return;
    this.snapshot();
    this.state.players[playerIndex].life = 1;
    this.persist();
    this.haptic();
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
    this.state.startingPlayerIndex = null;
    this.highlightedStarterIndex = null;
    this.isChoosingStarter = false;
    this.hideStarterResult();
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
      startingPlayerIndex: null,
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
        parsed.startingPlayerIndex = Number.isInteger(parsed.startingPlayerIndex) && parsed.startingPlayerIndex! < parsed.players.length
          ? parsed.startingPlayerIndex
          : null;
        this.state = parsed;
      }
    } catch {
      localStorage.removeItem(this.storageKey);
    }
  }

  private haptic(): void {
    this.vibrate(8);
  }

  private delay(duration: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, duration));
  }

  private hideStarterResult(): void {
    if (this.starterResultTimer) clearTimeout(this.starterResultTimer);
    this.starterResultTimer = undefined;
    this.starterResultVisible = false;
  }

  private vibrate(pattern: number | number[]): void {
    try {
      navigator.vibrate?.(pattern);
    } catch {
      // Haptics are optional and can be rejected after the initial user gesture.
    }
  }
}
