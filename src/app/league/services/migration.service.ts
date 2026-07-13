import { Injectable } from '@angular/core';
import { get, ref, update } from 'firebase/database';
import { firebaseDatabase } from '../../firebase';
import { PlayerCode } from '../models/teams';

@Injectable({ providedIn: 'root' })
export class MigrationService {
  private migrationPromise: Promise<void> | null = null;

  ensureMigrated(): Promise<void> {
    this.migrationPromise ??= this.runMigration().catch(error => {
      this.migrationPromise = null;
      throw error;
    });
    return this.migrationPromise;
  }

  private async runMigration(): Promise<void> {
    const snapshot = await get(ref(firebaseDatabase));
    const root = this.asRecord(snapshot.val());
    const meta = this.asRecord(root['meta']);

    const hasDecks = Object.keys(this.asRecord(root['decks'])).length > 0;
    const hasLeagues = Object.keys(this.asRecord(root['leagues'])).length > 0;
    if (Number(meta['schemaVersion']) >= 2 && hasDecks && hasLeagues) {
      return;
    }

    const now = Date.now();
    const legacyTeams = this.collection(root['teams']);
    const decks: Record<string, Record<string, unknown>> = {};
    const legacyIdMap = new Map<string, string>();

    legacyTeams.forEach((team, index) => {
      const originalId = String(team['id'] ?? index);
      const id = `legacy-${originalId.replace(/[.#$\[\]/]/g, '-')}`;
      const player = this.player(team['player']);
      const name = String(team['name'] ?? '').trim();

      if (!name) {
        return;
      }

      legacyIdMap.set(originalId, id);
      decks[id] = { id, name, player, active: true, createdAt: now, updatedAt: now };
    });

    const selectedDeckIds = { A: {} as Record<string, boolean>, P: {} as Record<string, boolean> };
    Object.values(decks).forEach(deck => {
      selectedDeckIds[deck['player'] as PlayerCode][deck['id'] as string] = true;
    });

    const migratedMatches: Record<string, Record<string, unknown>> = {};
    this.collection(root['matchs']).forEach((match, index) => {
      const team1 = this.asRecord(match['team1']);
      const team2 = this.asRecord(match['team2']);
      const winner = this.asRecord(match['winner']);
      const team1Id = legacyIdMap.get(String(team1['id']));
      const team2Id = legacyIdMap.get(String(team2['id']));

      if (!team1Id || !team2Id) {
        return;
      }

      const matchId = `match-${String(index + 1).padStart(3, '0')}`;
      migratedMatches[matchId] = {
        matchId,
        order: index,
        team1Id,
        team2Id,
        winnerDeckId: legacyIdMap.get(String(winner['id'])) ?? null,
      };
    });

    const changes: Record<string, unknown> = {
      'meta/schemaVersion': 2,
      'meta/migratedAt': now,
    };

    if (!root['decks']) {
      changes['decks'] = decks;
    }

    if (!root['leagues']) {
      changes['leagues/legacy-season-1'] = {
        id: 'legacy-season-1',
        name: 'La saison fondatrice',
        status: 'active',
        createdAt: now - 1,
        createdBy: 'A',
        startedAt: now - 1,
        closedAt: null,
        selectedDeckIds,
        deckSnapshots: decks,
        matches: migratedMatches,
      };
    }

    await update(ref(firebaseDatabase), changes);
  }

  private collection(value: unknown): Record<string, unknown>[] {
    if (Array.isArray(value)) {
      return value.filter((entry): entry is Record<string, unknown> => !!entry && typeof entry === 'object');
    }

    return Object.values(this.asRecord(value))
      .filter((entry): entry is Record<string, unknown> => !!entry && typeof entry === 'object');
  }

  private asRecord(value: unknown): Record<string, unknown> {
    return value && typeof value === 'object' ? value as Record<string, unknown> : {};
  }

  private player(value: unknown): PlayerCode {
    return value === 'P' || value === 'Pierre' ? 'P' : 'A';
  }
}
