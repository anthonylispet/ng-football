import { Injectable, NgZone } from '@angular/core';
import { onValue, ref, set } from 'firebase/database';
import { Observable, shareReplay, take } from 'rxjs';
import { firebaseDatabase } from '../../firebase';
import { Match } from '../models/match';
import { PlayerCode, Team } from '../models/teams';
import { TeamsService } from './teams.service';

@Injectable({ providedIn: 'root' })
export class CalendarService {
  private readonly matches$: Observable<Match[]>;

  constructor(
    private readonly teamsService: TeamsService,
    private readonly zone: NgZone,
  ) {
    this.matches$ = new Observable<Match[]>(subscriber => {
      const unsubscribe = onValue(
        ref(firebaseDatabase, 'matchs'),
        snapshot => this.zone.run(() => subscriber.next(this.normalizeMatches(snapshot.val()))),
        error => this.zone.run(() => subscriber.error(error)),
      );

      return unsubscribe;
    }).pipe(shareReplay({ bufferSize: 1, refCount: true }));
  }

  getMatchs(): Observable<Match[]> {
    return this.matches$;
  }

  updateWinner(matchIndex: number, winner: Team | null): Promise<void> {
    return set(ref(firebaseDatabase, `matchs/${matchIndex}/winner`), winner);
  }

  updateMatches(matches: Match[]): Promise<void> {
    return set(ref(firebaseDatabase, 'matchs'), matches);
  }

  resetCalendar(): void {
    this.teamsService.getTeams().pipe(take(1)).subscribe({
      next: teams => {
        const anthonyTeams = teams.filter(team => team.player === 'A');
        const pierreTeams = teams.filter(team => team.player === 'P');
        const numberOfSeries = Math.min(anthonyTeams.length, pierreTeams.length);
        const calendar: Match[] = [];

        for (let series = 0; series < numberOfSeries; series++) {
          for (let index = 0; index < numberOfSeries; index++) {
            calendar.push({
              matchId: calendar.length,
              team1: anthonyTeams[index],
              team2: pierreTeams[(index + series) % numberOfSeries],
              winner: null,
            });
          }
        }

        void this.updateMatches(calendar);
      },
      error: error => console.error('Impossible de générer le calendrier.', error),
    });
  }

  private normalizeMatches(value: unknown): Match[] {
    const entries = Array.isArray(value)
      ? value
      : value && typeof value === 'object'
        ? Object.values(value)
        : [];

    return entries
      .filter((entry): entry is Record<string, unknown> => !!entry && typeof entry === 'object')
      .map((entry, index) => {
        const team1 = this.normalizeTeam(entry['team1']);
        const team2 = this.normalizeTeam(entry['team2']);

        if (!team1 || !team2) {
          return null;
        }

        return {
          matchId: Number.isFinite(Number(entry['matchId'])) ? Number(entry['matchId']) : index,
          team1,
          team2,
          winner: this.normalizeTeam(entry['winner']),
        } satisfies Match;
      })
      .filter((match): match is Match => match !== null)
      .sort((left, right) => left.matchId - right.matchId);
  }

  private normalizeTeam(value: unknown): Team | null {
    if (!value || typeof value !== 'object') {
      return null;
    }

    const record = value as Record<string, unknown>;
    if (!Number.isFinite(Number(record['id'])) || typeof record['name'] !== 'string') {
      return null;
    }

    return {
      id: Number(record['id']),
      name: record['name'].trim(),
      player: this.normalizePlayer(record['player']),
    };
  }

  private normalizePlayer(value: unknown): PlayerCode {
    return value === 'P' || value === 'Pierre' ? 'P' : 'A';
  }
}
