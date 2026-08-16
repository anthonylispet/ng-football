import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';

type EntryMode = 'add' | 'set';
type SortMode = 'players' | 'highest' | 'lowest';

interface ScorePlayer {
  id: string;
  name: string;
  total: number;
  draft: string;
  color: string;
}

interface ScoreChange {
  playerId?: string;
  playerName: string;
  previousTotal: number;
  newTotal: number;
  difference: number;
}

interface ScoreRound {
  id: string;
  createdAt: number;
  changes: ScoreChange[];
}

interface ScoreState {
  players: ScorePlayer[];
  rounds: ScoreRound[];
  target: number;
  targetEnabled: boolean;
  entryMode: EntryMode;
  sortMode: SortMode;
}

@Component({
  selector: 'app-score-counter',
  standalone: true,
  templateUrl: './score-counter.component.html',
  styleUrls: ['./score-counter.component.scss'],
})
export class ScoreCounterComponent implements OnInit, OnDestroy {
  private readonly storageKey = 'score-pop-counter-v1';
  private readonly palette = ['coral', 'ocean', 'lime', 'violet', 'sun', 'pink', 'mint', 'indigo'];
  private history: ScoreState[] = [];
  private previousTitle = '';

  state: ScoreState = this.createInitialState();
  newPlayerName = '';
  settingsOpen = false;
  historyOpen = false;
  confirmReset = false;
  isFullscreen = false;
  expandedPlayerIds = new Set<string>();

  ngOnInit(): void {
    this.previousTitle = document.title;
    document.title = 'Score Pop · Compteur de scores';
    this.restore();
    this.isFullscreen = !!document.fullscreenElement;
  }

  ngOnDestroy(): void {
    document.title = this.previousTitle;
  }

  get canUndo(): boolean {
    return this.history.length > 0;
  }

  get sortedPlayers(): ScorePlayer[] {
    return [...this.state.players].sort((a, b) => b.total - a.total);
  }

  get displayedPlayers(): ScorePlayer[] {
    if (this.state.sortMode === 'highest') return [...this.state.players].sort((a, b) => b.total - a.total);
    if (this.state.sortMode === 'lowest') return [...this.state.players].sort((a, b) => a.total - b.total);
    return this.state.players;
  }

  get leaderId(): string | null {
    if (!this.state.players.length) return null;
    const best = Math.max(...this.state.players.map(player => player.total));
    const leaders = this.state.players.filter(player => player.total === best);
    return leaders.length === 1 && best !== 0 ? leaders[0].id : null;
  }

  get winnerId(): string | null {
    if (!this.state.targetEnabled) return null;
    return this.sortedPlayers.find(player => player.total >= this.state.target)?.id ?? null;
  }

  addPlayer(): void {
    const name = this.newPlayerName.trim() || `Joueur ${this.state.players.length + 1}`;
    this.snapshot();
    this.state.players.push(this.createPlayer(name, this.state.players.length));
    this.newPlayerName = '';
    this.persist();
  }

  removePlayer(player: ScorePlayer): void {
    if (this.state.players.length <= 1) return;
    this.snapshot();
    this.state.players = this.state.players.filter(candidate => candidate.id !== player.id);
    this.expandedPlayerIds.delete(player.id);
    this.persist();
  }

  updateName(player: ScorePlayer, event: Event): void {
    const value = (event.target as HTMLInputElement).value.trim();
    player.name = value || 'Sans nom';
    this.persist();
  }

  updateDraft(player: ScorePlayer, event: Event): void {
    player.draft = (event.target as HTMLInputElement).value;
  }

  submitScore(player: ScorePlayer): void {
    const value = Number(player.draft);
    if (!Number.isFinite(value) || player.draft.trim() === '') return;

    const previousTotal = player.total;
    const newTotal = this.state.entryMode === 'add' ? previousTotal + value : value;
    this.snapshot();
    player.total = newTotal;
    player.draft = '';
    this.recordRound([{
      playerId: player.id,
      playerName: player.name,
      previousTotal,
      newTotal,
      difference: newTotal - previousTotal,
    }]);
    this.persist();
    this.haptic();
  }

  quickAdd(player: ScorePlayer, amount: number): void {
    const previousTotal = player.total;
    this.snapshot();
    player.total += amount;
    this.recordRound([{
      playerId: player.id,
      playerName: player.name,
      previousTotal,
      newTotal: player.total,
      difference: amount,
    }]);
    this.persist();
    this.haptic();
  }

  setEntryMode(mode: EntryMode): void {
    this.state.entryMode = mode;
    this.state.players.forEach(player => player.draft = '');
    this.persist();
  }

  setSortMode(mode: SortMode): void {
    this.state.sortMode = mode;
    this.persist();
  }

  setTarget(event: Event): void {
    const value = Number((event.target as HTMLInputElement).value);
    if (Number.isFinite(value) && value > 0) {
      this.state.target = Math.round(value);
      this.persist();
    }
  }

  setTargetValue(value: number): void {
    this.state.target = value;
    this.persist();
  }

  toggleTarget(): void {
    this.state.targetEnabled = !this.state.targetEnabled;
    this.persist();
  }

  undo(): void {
    const previous = this.history.pop();
    if (!previous) return;
    this.state = previous;
    this.persist();
  }

  resetGame(): void {
    this.snapshot();
    this.state.players.forEach(player => {
      player.total = 0;
      player.draft = '';
    });
    this.state.rounds = [];
    this.expandedPlayerIds.clear();
    this.confirmReset = false;
    this.settingsOpen = false;
    this.persist();
  }

  formatTime(timestamp: number): string {
    return new Intl.DateTimeFormat('fr-BE', { hour: '2-digit', minute: '2-digit' }).format(timestamp);
  }

  progress(player: ScorePlayer): number {
    if (!this.state.targetEnabled || this.state.target <= 0) return 0;
    return Math.min(100, Math.max(0, player.total / this.state.target * 100));
  }

  entryCount(player: ScorePlayer): number {
    return this.state.rounds.reduce((count, round) =>
      count + round.changes.filter(change => this.belongsToPlayer(change, player)).length, 0);
  }

  scorePath(player: ScorePlayer): number[] {
    const changes = this.state.rounds
      .slice()
      .reverse()
      .flatMap(round => round.changes)
      .filter(change => this.belongsToPlayer(change, player));
    if (!changes.length) return [player.total];
    return [changes[0].previousTotal, ...changes.map(change => change.newTotal)];
  }

  isEvolutionOpen(player: ScorePlayer): boolean {
    return this.expandedPlayerIds.has(player.id);
  }

  toggleEvolution(player: ScorePlayer): void {
    const expanded = new Set(this.expandedPlayerIds);
    if (expanded.has(player.id)) expanded.delete(player.id);
    else expanded.add(player.id);
    this.expandedPlayerIds = expanded;
  }

  async toggleFullscreen(): Promise<void> {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch {
      // Fullscreen remains an optional enhancement.
    }
  }

  @HostListener('document:fullscreenchange')
  onFullscreenChange(): void {
    this.isFullscreen = !!document.fullscreenElement;
  }

  private createInitialState(): ScoreState {
    return {
      players: [this.createPlayer('Joueur 1', 0), this.createPlayer('Joueur 2', 1), this.createPlayer('Joueur 3', 2)],
      rounds: [],
      target: 500,
      targetEnabled: true,
      entryMode: 'add',
      sortMode: 'players',
    };
  }

  private createPlayer(name: string, index: number): ScorePlayer {
    return {
      id: `${Date.now()}-${index}-${Math.random().toString(36).slice(2, 7)}`,
      name,
      total: 0,
      draft: '',
      color: this.palette[index % this.palette.length],
    };
  }

  private recordRound(changes: ScoreChange[]): void {
    this.state.rounds.unshift({ id: `${Date.now()}-${Math.random()}`, createdAt: Date.now(), changes });
    this.state.rounds = this.state.rounds.slice(0, 50);
  }

  private snapshot(): void {
    this.history.push(structuredClone(this.state));
    if (this.history.length > 40) this.history.shift();
  }

  private persist(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.state));
  }

  private restore(): void {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (!saved) return;
      const parsed = JSON.parse(saved) as ScoreState;
      if (Array.isArray(parsed.players) && parsed.players.length && Array.isArray(parsed.rounds)) {
        parsed.sortMode ??= 'players';
        parsed.rounds.forEach(round => round.changes.forEach(change => {
          change.playerId ??= parsed.players.find(player => player.name === change.playerName)?.id;
        }));
        this.state = parsed;
      }
    } catch {
      localStorage.removeItem(this.storageKey);
    }
  }

  private haptic(): void {
    navigator.vibrate?.(8);
  }

  private belongsToPlayer(change: ScoreChange, player: ScorePlayer): boolean {
    return change.playerId ? change.playerId === player.id : change.playerName === player.name;
  }
}
