import { Injectable, NgZone } from '@angular/core';
import { onValue, push, ref, remove, set, update } from 'firebase/database';
import { BehaviorSubject, Observable, shareReplay } from 'rxjs';
import { firebaseDatabase } from '../../firebase';
import { QuickMatch } from '../models/quick-match';
import { PlayerCode, Team } from '../models/teams';
import { drawQuickMatch } from '../utils/quick-match-draw';

@Injectable({ providedIn: 'root' })
export class QuickMatchesService {
  private readonly localStorageKey = 'quickMatches.local.v1';
  private readonly localMode = this.isLocalDevelopment();
  private readonly localMatchesSubject: BehaviorSubject<QuickMatch[]> | null;
  private readonly matches$: Observable<QuickMatch[]>;

  constructor(private readonly zone: NgZone) {
    if (this.localMode) {
      this.localMatchesSubject = new BehaviorSubject(this.readLocalMatches());
      this.matches$ = this.localMatchesSubject.asObservable();
      return;
    }

    this.localMatchesSubject = null;
    this.matches$ = new Observable<QuickMatch[]>(subscriber => {
      const unsubscribe = onValue(
        ref(firebaseDatabase, 'quickMatches'),
        snapshot => this.zone.run(() => subscriber.next(this.normalizeMatches(snapshot.val()))),
        error => this.zone.run(() => subscriber.error(error)),
      );

      return unsubscribe;
    }).pipe(shareReplay({ bufferSize: 1, refCount: true }));
  }

  getMatches(): Observable<QuickMatch[]> {
    return this.matches$;
  }

  async createMatch(
    teams: Team[],
    history: QuickMatch[],
    createdBy: PlayerCode,
  ): Promise<string> {
    const draw = drawQuickMatch(teams, history);
    const createdAt = Date.now();

    if (this.localMatchesSubject) {
      const id = `local-${createdAt}-${Math.random().toString(36).slice(2, 8)}`;
      const match: QuickMatch = {
        id,
        createdAt,
        createdBy,
        teamA: { ...draw.teamA.team },
        teamP: { ...draw.teamP.team },
        probabilityA: draw.teamA.probability,
        probabilityP: draw.teamP.probability,
        winner: null,
      };
      this.saveLocalMatches([match, ...this.localMatchesSubject.value]);
      return id;
    }

    const matchRef = push(ref(firebaseDatabase, 'quickMatches'));
    const id = matchRef.key!;
    await set(matchRef, {
      id,
      createdAt,
      createdBy,
      deckA: draw.teamA.team,
      deckP: draw.teamP.team,
      probabilityA: draw.teamA.probability,
      probabilityP: draw.teamP.probability,
      winnerDeckId: null,
    });

    return id;
  }

  updateWinner(matchId: string, winner: Team | null): Promise<void> {
    if (this.localMatchesSubject) {
      const matches = this.localMatchesSubject.value.map(match =>
        match.id === matchId ? { ...match, winner } : match,
      );
      this.saveLocalMatches(matches);
      return Promise.resolve();
    }

    return update(ref(firebaseDatabase, `quickMatches/${matchId}`), {
      winnerDeckId: winner?.id ?? null,
    });
  }

  deleteMatch(matchId: string): Promise<void> {
    if (this.localMatchesSubject) {
      this.saveLocalMatches(this.localMatchesSubject.value.filter(match => match.id !== matchId));
      return Promise.resolve();
    }

    return remove(ref(firebaseDatabase, `quickMatches/${matchId}`));
  }

  private normalizeMatches(value: unknown): QuickMatch[] {
    const record = this.asRecord(value);

    return Object.entries(record)
      .map(([id, entry]) => this.normalizeMatch(entry, id))
      .filter((match): match is QuickMatch => match !== null)
      .sort((left, right) => right.createdAt - left.createdAt);
  }

  private readLocalMatches(): QuickMatch[] {
    try {
      return this.normalizeMatches(JSON.parse(localStorage.getItem(this.localStorageKey) ?? '{}'));
    } catch (error) {
      console.warn('Impossible de lire l’historique local des matchs rapides.', error);
      return [];
    }
  }

  private saveLocalMatches(matches: QuickMatch[]): void {
    try {
      localStorage.setItem(
        this.localStorageKey,
        JSON.stringify(matches.map(match => ({
          id: match.id,
          createdAt: match.createdAt,
          createdBy: match.createdBy,
          deckA: match.teamA,
          deckP: match.teamP,
          probabilityA: match.probabilityA,
          probabilityP: match.probabilityP,
          winnerDeckId: match.winner?.id ?? null,
        }))),
      );
      this.localMatchesSubject?.next(matches);
    } catch (error) {
      console.error('Impossible d’enregistrer l’historique local des matchs rapides.', error);
      throw error;
    }
  }

  private normalizeMatch(value: unknown, fallbackId: string): QuickMatch | null {
    const entry = this.asRecord(value);
    const teamA = this.normalizeTeam(entry['deckA'], 'A');
    const teamP = this.normalizeTeam(entry['deckP'], 'P');
    if (!teamA || !teamP) return null;

    const winnerDeckId = String(entry['winnerDeckId'] ?? '');
    const winner = winnerDeckId === teamA.id
      ? teamA
      : winnerDeckId === teamP.id
        ? teamP
        : null;

    return {
      id: String(entry['id'] ?? fallbackId),
      createdAt: Number(entry['createdAt']) || 0,
      createdBy: entry['createdBy'] === 'P' ? 'P' : 'A',
      teamA,
      teamP,
      probabilityA: this.probability(entry['probabilityA']),
      probabilityP: this.probability(entry['probabilityP']),
      winner,
    };
  }

  private normalizeTeam(value: unknown, player: PlayerCode): Team | null {
    const entry = this.asRecord(value);
    const id = String(entry['id'] ?? '');
    const name = String(entry['name'] ?? '').trim();
    if (!id || !name) return null;

    return {
      id,
      name,
      player,
      active: entry['active'] !== false,
      createdAt: Number(entry['createdAt']) || 0,
      updatedAt: Number(entry['updatedAt']) || 0,
    };
  }

  private probability(value: unknown): number {
    const probability = Number(value);
    return Number.isFinite(probability) ? Math.min(Math.max(probability, 0), 1) : 0;
  }

  private asRecord(value: unknown): Record<string, unknown> {
    return value && typeof value === 'object' ? value as Record<string, unknown> : {};
  }

  private isLocalDevelopment(): boolean {
    return typeof location !== 'undefined'
      && (location.hostname === 'localhost' || location.hostname === '127.0.0.1');
  }
}
