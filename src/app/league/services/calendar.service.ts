import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Match } from '../models/match';
import { Team } from '../models/teams';
import { LeaguesService } from './leagues.service';

@Injectable({ providedIn: 'root' })
export class CalendarService {
  constructor(private readonly leaguesService: LeaguesService) {}

  getMatchs(): Observable<Match[]> {
    return this.leaguesService.selectedLeague$.pipe(map(league => league?.matches ?? []));
  }

  updateWinner(leagueId: string, matchId: string, winner: Team | null): Promise<void> {
    return this.leaguesService.updateWinner(leagueId, matchId, winner?.id ?? null);
  }
}
