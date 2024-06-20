import { Injectable } from '@angular/core';
import {Match} from "../models/match";
import {BehaviorSubject, catchError, Observable, of, Subject, takeUntil} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Standing} from "../../football-results/models/class/standing";
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {TeamsService} from "./teams.service";
import {Player} from "../models/teams";

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  private destroy$ = new Subject<void>();

  constructor(private http: HttpClient,private db: AngularFireDatabase,private teamsService: TeamsService) { }

  getMatchs(): Observable<Match[]> {
    return this.db.object('/matchs').valueChanges() as Observable<Match[]>;
  }

  /*updateMatches(matchs: Match[]): Observable<any> {

    /*return this.http.put('assets/matchs.json', matchs).pipe(
        catchError(this.handleError<any>('updateMatches'))
    );
  }*/

  updateMatches(matchs: Match[]) {
  // Référence à la collection
    const reference = this.db.object("/matchs");

    // Mettre à jour les données avec le nouveau JSON
    reference.set(matchs)
      .then(() => {
        console.log("Données mises à jour avec succès !");
      })
      .catch((error) => {
        console.error("Erreur lors de la mise à jour des données : ", error);
      });
}

  // Gestion des erreurs
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }


  resetCalendar(){
    this.teamsService.getTeams().pipe(takeUntil(this.destroy$)).subscribe(teams=>{
      const aTeams= teams.filter(team=> team.player.toString() === 'A');
      const pTeams= teams.filter(team=> team.player.toString() === 'P');
      let calendar:Match[]=[];

      let nbSeries = (aTeams.length)
      let cpt = 0;

      for (let i = 1 ; i<= nbSeries ; i++){
        cpt=(i-1);
        for (let j =0 ; j < (aTeams.length); j++ ){

          console.log((((i-1)*aTeams.length)+j+1)+' - '+j+' - '+cpt);



          let match: Match = {
            matchId : (((i-1)*aTeams.length-1)+j+1),
            team1 : aTeams[j],
            team2 :pTeams[cpt]
          }
          calendar.push(match);

          cpt++;
          cpt = cpt >= (aTeams.length) ? 0 : cpt;
        }

      }

      //on trie le résultat par matchId
      calendar.sort((match,match2) => {
        return match.matchId - match2.matchId
      });

      const reference = this.db.object("/matchs");
      reference.set(calendar)
        .then(() => {
          console.log("Données mises à jour avec succès !");
        })
        .catch((error) => {
          console.error("Erreur lors de la mise à jour des données : ", error);
        });
    });

  }

  ngOnDestroy(){
    this.destroy$.next();
    this.destroy$.complete();
  }
}
