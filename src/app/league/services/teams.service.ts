import { Injectable, NgZone } from '@angular/core';
import { onValue, push, ref, set, update } from 'firebase/database';
import { Observable, shareReplay } from 'rxjs';
import { firebaseDatabase } from '../../firebase';
import { PlayerCode, Team } from '../models/teams';
import { MigrationService } from './migration.service';

@Injectable({ providedIn: 'root' })
export class TeamsService {
  private readonly teams$: Observable<Team[]>;

  constructor(
    private readonly migrationService: MigrationService,
    private readonly zone: NgZone,
  ) {
    this.teams$ = new Observable<Team[]>(subscriber => {
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
  }

  getTeams(): Observable<Team[]> {
    return this.teams$;
  }

  async createTeam(name: string, player: PlayerCode): Promise<Team> {
    const teamRef = push(ref(firebaseDatabase, 'decks'));
    const now = Date.now();
    const team: Team = {
      id: teamRef.key!,
      name: name.trim(),
      player,
      active: true,
      createdAt: now,
      updatedAt: now,
    };
    await set(teamRef, team);
    return team;
  }

  updateTeam(teamId: string, name: string): Promise<void> {
    return update(ref(firebaseDatabase, `decks/${teamId}`), {
      name: name.trim(),
      updatedAt: Date.now(),
    });
  }

  setTeamActive(teamId: string, active: boolean): Promise<void> {
    return update(ref(firebaseDatabase, `decks/${teamId}`), {
      active,
      updatedAt: Date.now(),
    });
  }

  private normalizeTeams(value: unknown): Team[] {
    const record = value && typeof value === 'object' ? value as Record<string, unknown> : {};

    return Object.entries(record)
      .map(([key, entry]) => this.normalizeTeam(entry, key))
      .filter((team): team is Team => team !== null)
      .sort((left, right) => left.name.localeCompare(right.name, 'fr'));
  }

  private normalizeRoot(value: unknown): Team[] {
    const root = value && typeof value === 'object' ? value as Record<string, unknown> : {};
    const currentTeams = this.normalizeTeams(root['decks']);
    const currentIds = new Set(currentTeams.map(team => team.id));
    const legacyValue = root['teams'];
    const legacyRecord = Array.isArray(legacyValue)
      ? Object.fromEntries(legacyValue.map((team, index) => [String(index), team]))
      : legacyValue && typeof legacyValue === 'object'
        ? legacyValue as Record<string, unknown>
        : {};
    const legacyTeams = Object.entries(legacyRecord)
      .map(([key, entry]) => this.normalizeLegacyTeam(entry, key))
      .filter((team): team is Team => team !== null)
      .filter(team => !currentIds.has(team.id));

    return [...currentTeams, ...legacyTeams]
      .sort((left, right) => left.name.localeCompare(right.name, 'fr'));
  }

  private normalizeTeam(value: unknown, fallbackId: string): Team | null {
    if (!value || typeof value !== 'object') return null;
    const entry = value as Record<string, unknown>;
    const name = String(entry['name'] ?? '').trim();
    if (!name) return null;

    return {
      id: String(entry['id'] ?? fallbackId),
      name,
      player: entry['player'] === 'P' || entry['player'] === 'Pierre' ? 'P' : 'A',
      active: entry['active'] !== false,
      createdAt: Number(entry['createdAt']) || 0,
      updatedAt: Number(entry['updatedAt']) || 0,
    };
  }

  private normalizeLegacyTeam(value: unknown, fallbackId: string): Team | null {
    if (!value || typeof value !== 'object') return null;
    const entry = value as Record<string, unknown>;
    const name = String(entry['name'] ?? '').trim();
    if (!name) return null;
    const originalId = String(entry['id'] ?? fallbackId);
    return {
      id: `legacy-${originalId.replace(/[.#$\[\]/]/g, '-')}`,
      name,
      player: entry['player'] === 'P' || entry['player'] === 'Pierre' ? 'P' : 'A',
      active: true,
      createdAt: 0,
      updatedAt: 0,
    };
  }
}
