import { Injectable, NgZone } from '@angular/core';
import { onValue, ref } from 'firebase/database';
import { Observable, shareReplay } from 'rxjs';
import { firebaseDatabase } from '../../firebase';
import { PlayerCode, Team } from '../models/teams';

@Injectable({ providedIn: 'root' })
export class TeamsService {
  private readonly teams$: Observable<Team[]>;

  constructor(private readonly zone: NgZone) {
    this.teams$ = new Observable<Team[]>(subscriber => {
      const unsubscribe = onValue(
        ref(firebaseDatabase, 'teams'),
        snapshot => this.zone.run(() => subscriber.next(this.normalizeTeams(snapshot.val()))),
        error => this.zone.run(() => subscriber.error(error)),
      );

      return unsubscribe;
    }).pipe(shareReplay({ bufferSize: 1, refCount: true }));
  }

  getTeams(): Observable<Team[]> {
    return this.teams$;
  }

  private normalizeTeams(value: unknown): Team[] {
    const entries = Array.isArray(value)
      ? value
      : value && typeof value === 'object'
        ? Object.values(value)
        : [];

    return entries
      .filter((entry): entry is Record<string, unknown> => !!entry && typeof entry === 'object')
      .filter(entry => Number.isFinite(Number(entry['id'])) && typeof entry['name'] === 'string')
      .map(entry => ({
        id: Number(entry['id']),
        name: String(entry['name']).trim(),
        player: this.normalizePlayer(entry['player']),
      }))
      .filter(team => team.name.length > 0)
      .sort((left, right) => left.id - right.id);
  }

  private normalizePlayer(value: unknown): PlayerCode {
    return value === 'P' || value === 'Pierre' ? 'P' : 'A';
  }
}
