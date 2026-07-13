import { Injectable, NgZone } from '@angular/core';
import { onValue, push, ref, remove, runTransaction, set, update } from 'firebase/database';
import { BehaviorSubject, combineLatest, map, Observable, shareReplay } from 'rxjs';
import { League, LeagueCreationResult, LeagueStatus } from '../models/league';
import { Match } from '../models/match';
import { PlayerCode, Team } from '../models/teams';
import { firebaseDatabase } from '../../firebase';
import { MigrationService } from './migration.service';
import { generateTournamentMatches } from '../utils/schedule-generator';

@Injectable({ providedIn: 'root' })
export class LeaguesService {
  readonly maxOpenLeagues = 3;
  private readonly selectedLeagueIdSubject = new BehaviorSubject<string | null>(this.readStoredSelection());
  private readonly leagues$: Observable<League[]>;
  readonly selectedLeague$: Observable<League | null>;

  constructor(
    private readonly migrationService: MigrationService,
    private readonly zone: NgZone,
  ) {
    this.leagues$ = new Observable<League[]>(subscriber => {
      void this.migrationService.ensureMigrated().catch(error =>
        console.warn('La migration Firebase sera retentée ultérieurement.', error),
      );

      const unsubscribe = onValue(
        ref(firebaseDatabase),
        snapshot => this.zone.run(() => subscriber.next(this.normalizeRoot(snapshot.val()))),
        error => this.zone.run(() => subscriber.error(error)),
      );

      return unsubscribe;
    }).pipe(shareReplay({ bufferSize: 1, refCount: true }));

    this.selectedLeague$ = combineLatest([this.leagues$, this.selectedLeagueIdSubject]).pipe(
      map(([leagues, selectedId]) => {
        const explicit = leagues.find(league => league.id === selectedId);
        if (explicit) return explicit;
        return leagues.find(league => league.status !== 'closed') ?? leagues[0] ?? null;
      }),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
  }

  getLeagues(): Observable<League[]> {
    return this.leagues$;
  }

  selectLeague(leagueId: string): void {
    this.selectedLeagueIdSubject.next(leagueId);
    try { localStorage.setItem('selectedLeagueId', leagueId); } catch { /* storage indisponible */ }
  }

  async createLeague(name: string, createdBy: PlayerCode): Promise<LeagueCreationResult> {
    const leagueRef = push(ref(firebaseDatabase, 'leagues'));
    const league: League = {
      id: leagueRef.key!,
      name: name.trim(),
      status: 'draft',
      createdAt: Date.now(),
      createdBy,
      startedAt: null,
      closedAt: null,
      selectedDeckIds: { A: [], P: [] },
      deckSnapshots: {},
      matches: [],
    };
    const result = await runTransaction(ref(firebaseDatabase, 'leagues'), currentValue => {
      const current = this.asRecord(currentValue);
      const openCount = Object.values(current).filter(value => this.status(this.asRecord(value)['status']) !== 'closed').length;
      if (openCount >= this.maxOpenLeagues) return;
      return { ...current, [league.id]: this.serializeLeague(league) };
    }, { applyLocally: false });
    if (!result.committed) throw new Error('MAX_OPEN_LEAGUES');
    this.selectLeague(league.id);
    return { id: league.id, league };
  }

  updateDeckSelection(leagueId: string, player: PlayerCode, deckIds: string[]): Promise<void> {
    const selection = Object.fromEntries(deckIds.map(id => [id, true]));
    return set(ref(firebaseDatabase, `leagues/${leagueId}/selectedDeckIds/${player}`), selection);
  }

  startLeague(league: League, allDecks: Team[]): Promise<void> {
    const selectedIds = new Set([...league.selectedDeckIds.A, ...league.selectedDeckIds.P]);
    const snapshots = Object.fromEntries(
      allDecks.filter(deck => selectedIds.has(deck.id)).map(deck => [deck.id, deck]),
    );
    const anthonyDecks = league.selectedDeckIds.A.map(id => snapshots[id]).filter(Boolean);
    const pierreDecks = league.selectedDeckIds.P.map(id => snapshots[id]).filter(Boolean);

    if (!anthonyDecks.length || !pierreDecks.length) {
      return Promise.reject(new Error('MISSING_DECK_SELECTION'));
    }

    const matches = generateTournamentMatches(anthonyDecks, pierreDecks);
    return update(ref(firebaseDatabase, `leagues/${league.id}`), {
      status: 'active',
      startedAt: Date.now(),
      deckSnapshots: snapshots,
      matches: Object.fromEntries(matches.map(match => [match.matchId, {
        matchId: match.matchId,
        order: match.order,
        team1Id: match.team1.id,
        team2Id: match.team2.id,
        winnerDeckId: null,
      }])),
    });
  }

  closeLeague(leagueId: string): Promise<void> {
    return update(ref(firebaseDatabase, `leagues/${leagueId}`), {
      status: 'closed',
      closedAt: Date.now(),
    });
  }

  deleteLeague(leagueId: string): Promise<void> {
    return remove(ref(firebaseDatabase, `leagues/${leagueId}`));
  }

  updateWinner(leagueId: string, matchId: string, winnerDeckId: string | null): Promise<void> {
    return set(ref(firebaseDatabase, `leagues/${leagueId}/matches/${matchId}/winnerDeckId`), winnerDeckId);
  }

  private normalizeLeagues(value: unknown): League[] {
    const record = this.asRecord(value);
    return Object.entries(record)
      .map(([key, entry]) => this.normalizeLeague(entry, key))
      .filter((league): league is League => league !== null);
  }

  private normalizeRoot(value: unknown): League[] {
    const root = this.asRecord(value);
    const leagues = this.normalizeLeagues(root['leagues']);
    const persistedLegacyLeague = leagues.find(league => league.id === 'legacy-season-1');
    const legacyMatchCount = this.collection(root['matchs']).length;
    const persistedLegacyIsUsable = !!persistedLegacyLeague
      && Object.keys(persistedLegacyLeague.deckSnapshots).length > 0
      && (legacyMatchCount === 0 || persistedLegacyLeague.matches.length > 0);
    const usableLeagues = persistedLegacyIsUsable
      ? leagues
      : leagues.filter(league => league.id !== 'legacy-season-1');
    const legacyLeague = persistedLegacyIsUsable ? null : this.buildLegacyLeague(root['teams'], root['matchs']);

    return [...usableLeagues, ...(legacyLeague ? [legacyLeague] : [])].sort((left, right) => {
      const leftClosed = left.status === 'closed' ? 1 : 0;
      const rightClosed = right.status === 'closed' ? 1 : 0;
      return leftClosed - rightClosed || right.createdAt - left.createdAt;
    });
  }

  private buildLegacyLeague(teamsValue: unknown, matchesValue: unknown): League | null {
    const teams = this.collection(teamsValue)
      .map((entry, index) => this.normalizeLegacyTeam(entry, String(index)))
      .filter((team): team is Team => team !== null);
    if (!teams.length) return null;

    const snapshots = Object.fromEntries(teams.map(team => [team.id, team]));
    const matches = this.collection(matchesValue)
      .map((entry, index): Match | null => {
        const team1Id = this.legacyTeamId(this.asRecord(entry['team1'])['id']);
        const team2Id = this.legacyTeamId(this.asRecord(entry['team2'])['id']);
        const team1 = snapshots[team1Id];
        const team2 = snapshots[team2Id];
        if (!team1 || !team2) return null;
        const winnerId = this.legacyTeamId(this.asRecord(entry['winner'])['id']);
        return {
          matchId: `match-${String(index + 1).padStart(3, '0')}`,
          order: index,
          team1,
          team2,
          winner: snapshots[winnerId] ?? null,
        };
      })
      .filter((match): match is Match => match !== null);

    return {
      id: 'legacy-season-1',
      name: 'La saison fondatrice',
      status: 'active',
      createdAt: 0,
      createdBy: 'A',
      startedAt: 0,
      closedAt: null,
      selectedDeckIds: {
        A: teams.filter(team => team.player === 'A').map(team => team.id),
        P: teams.filter(team => team.player === 'P').map(team => team.id),
      },
      deckSnapshots: snapshots,
      matches,
    };
  }

  private normalizeLeague(value: unknown, fallbackId: string): League | null {
    const entry = this.asRecord(value);
    const name = String(entry['name'] ?? '').trim();
    if (!name) return null;

    const snapshots = Object.fromEntries(
      Object.entries(this.asRecord(entry['deckSnapshots']))
        .map(([key, deck]) => [key, this.normalizeTeam(deck, key)] as const)
        .filter((pair): pair is [string, Team] => pair[1] !== null),
    );
    const matches = Object.entries(this.asRecord(entry['matches']))
      .map(([key, match]) => this.normalizeMatch(match, key, snapshots))
      .filter((match): match is Match => match !== null)
      .sort((left, right) => left.order - right.order);

    return {
      id: String(entry['id'] ?? fallbackId),
      name,
      status: this.status(entry['status']),
      createdAt: Number(entry['createdAt']) || 0,
      createdBy: this.player(entry['createdBy']),
      startedAt: Number(entry['startedAt']) || null,
      closedAt: Number(entry['closedAt']) || null,
      selectedDeckIds: {
        A: this.selection(entry['selectedDeckIds'], 'A'),
        P: this.selection(entry['selectedDeckIds'], 'P'),
      },
      deckSnapshots: snapshots,
      matches,
    };
  }

  private normalizeMatch(value: unknown, fallbackId: string, snapshots: Record<string, Team>): Match | null {
    const entry = this.asRecord(value);
    const team1 = snapshots[String(entry['team1Id'] ?? '')];
    const team2 = snapshots[String(entry['team2Id'] ?? '')];
    if (!team1 || !team2) return null;
    const winnerId = String(entry['winnerDeckId'] ?? '');

    return {
      matchId: String(entry['matchId'] ?? fallbackId),
      order: Number(entry['order']) || 0,
      team1,
      team2,
      winner: snapshots[winnerId] ?? null,
    };
  }

  private normalizeTeam(value: unknown, fallbackId: string): Team | null {
    const entry = this.asRecord(value);
    const name = String(entry['name'] ?? '').trim();
    if (!name) return null;
    return {
      id: String(entry['id'] ?? fallbackId),
      name,
      player: this.player(entry['player']),
      active: entry['active'] !== false,
      createdAt: Number(entry['createdAt']) || 0,
      updatedAt: Number(entry['updatedAt']) || 0,
    };
  }

  private normalizeLegacyTeam(value: unknown, fallbackId: string): Team | null {
    const entry = this.asRecord(value);
    const name = String(entry['name'] ?? '').trim();
    if (!name) return null;
    return {
      id: this.legacyTeamId(entry['id'] ?? fallbackId),
      name,
      player: this.player(entry['player']),
      active: true,
      createdAt: 0,
      updatedAt: 0,
    };
  }

  private legacyTeamId(value: unknown): string {
    if (value === undefined || value === null || value === '') return '';
    return `legacy-${String(value).replace(/[.#$\[\]/]/g, '-')}`;
  }

  private collection(value: unknown): Record<string, unknown>[] {
    if (Array.isArray(value)) {
      return value.filter((entry): entry is Record<string, unknown> => !!entry && typeof entry === 'object');
    }
    return Object.values(this.asRecord(value))
      .filter((entry): entry is Record<string, unknown> => !!entry && typeof entry === 'object');
  }

  private selection(value: unknown, player: PlayerCode): string[] {
    const raw = this.asRecord(value)[player];
    if (Array.isArray(raw)) return raw.map(String);
    return Object.entries(this.asRecord(raw)).filter(([, selected]) => !!selected).map(([id]) => id);
  }

  private serializeLeague(league: League): Record<string, unknown> {
    return {
      ...league,
      selectedDeckIds: { A: {}, P: {} },
      deckSnapshots: {},
      matches: {},
    };
  }

  private asRecord(value: unknown): Record<string, unknown> {
    return value && typeof value === 'object' ? value as Record<string, unknown> : {};
  }

  private player(value: unknown): PlayerCode {
    return value === 'P' || value === 'Pierre' ? 'P' : 'A';
  }

  private status(value: unknown): LeagueStatus {
    return value === 'active' || value === 'closed' ? value : 'draft';
  }

  private readStoredSelection(): string | null {
    try { return localStorage.getItem('selectedLeagueId'); } catch { return null; }
  }
}
