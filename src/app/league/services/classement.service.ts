import { Injectable } from '@angular/core';
import { combineLatest, map, Observable, shareReplay } from 'rxjs';
import { Classement } from '../models/classement';
import { CalendarService } from './calendar.service';
import { TeamsService } from './teams.service';

@Injectable({ providedIn: 'root' })
export class ClassementService {
  private readonly classement$: Observable<Classement[]>;

  constructor(
    private readonly teamsService: TeamsService,
    private readonly calendarService: CalendarService,
  ) {
    this.classement$ = combineLatest([
      this.teamsService.getTeams(),
      this.calendarService.getMatchs(),
    ]).pipe(
      map(([teams, matches]) => teams.map(team => ({
        team,
        nbPlayed: matches.filter(match =>
          match.winner !== null && (match.team1.id === team.id || match.team2.id === team.id),
        ).length,
        nbVictory: matches.filter(match => match.winner?.id === team.id).length,
      }))),
      map(classement => classement.sort((left, right) =>
        right.nbVictory - left.nbVictory
        || right.nbPlayed - left.nbPlayed
        || left.team.name.localeCompare(right.team.name, 'fr'),
      )),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
  }

  getClassement(): Observable<Classement[]> {
    return this.classement$;
  }
}
