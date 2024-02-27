import { Injectable } from '@angular/core';
import {BehaviorSubject, forkJoin, map, Observable, of, switchMap} from "rxjs";
import {Classement} from "../models/classement";
import {League} from "../../football-results/models/class/league";
import {Standing} from "../../football-results/models/class/standing";
import {TeamsService} from "./teams.service";
import {CalendarService} from "./calendar.service";
import {Player, Team} from "../models/teams";
import {Match} from "../models/match";

@Injectable({
  providedIn: 'root'
})
export class ClassementService {

  private _currentClassement: BehaviorSubject<Classement[]|null > = new BehaviorSubject<Classement[] |null>(null);
  currentClassement$ = this._currentClassement.asObservable();

  constructor(private teamsService: TeamsService,private calendarService: CalendarService) { }

  getClassement(): Observable<Classement[]> {
    return this.teamsService.getTeams().pipe(
      switchMap(teams => {
        return this.calendarService.getMatchs().pipe(
          map(matchs => {
            const classement: Classement[] = [];

            teams.forEach(team => {
              const nbPlayed = matchs.filter(match => ( (match.team1.id === team.id || match.team2.id === team.id) && (match.winner?.id != null) )).length;
              const nbVictory = matchs.filter(match => ( match.winner?.id === team.id)).length;

              classement.push({
                team: team,
                nbPlayed: nbPlayed,
                nbVictory: nbVictory
              });
            });
            classement.sort((a,b)=> b.nbVictory - a.nbVictory);
            return classement;
          })
        );
      })
    );
  }

  setCurrentClassement(classement:Classement[]) {
    this._currentClassement.next(classement);
  }
}
