import { Injectable } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { Classement } from '../models/classement';
import { LeaguesService } from './leagues.service';

@Injectable({ providedIn: 'root' })
export class ClassementService {
  readonly classement$: Observable<Classement[]>;

  constructor(private readonly leaguesService: LeaguesService) {
    this.classement$ = this.leaguesService.selectedLeague$.pipe(
      map(league => {
        if (!league) return [];
        return Object.values(league.deckSnapshots).map(team => ({
          team,
          nbPlayed: league.matches.filter(match =>
            match.winner !== null && (match.team1.id === team.id || match.team2.id === team.id),
          ).length,
          nbVictory: league.matches.filter(match => match.winner?.id === team.id).length,
        })).sort((left, right) =>
          right.nbVictory - left.nbVictory
          || right.nbPlayed - left.nbPlayed
          || left.team.name.localeCompare(right.team.name, 'fr'),
        );
      }),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
  }

  getClassement(): Observable<Classement[]> {
    return this.classement$;
  }
}
