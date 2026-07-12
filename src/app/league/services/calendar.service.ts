import { Injectable } from '@angular/core';
import {Match} from "../models/match";
import { Observable, Subject, takeUntil } from 'rxjs';
import { onValue, ref, set } from 'firebase/database';
import {TeamsService} from "./teams.service";
import { firebaseDatabase } from '../../firebase';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  private destroy$ = new Subject<void>();

  constructor(private teamsService: TeamsService) { }

  getMatchs(): Observable<Match[]> {
    return new Observable<Match[]>(subscriber =>
      onValue(
        ref(firebaseDatabase, 'matchs'),
        snapshot => subscriber.next(snapshot.val() ?? []),
        error => subscriber.error(error)
      )
    );
  }

  /*updateMatches(matchs: Match[]): Observable<any> {

    /*return this.http.put('assets/matchs.json', matchs).pipe(
        catchError(this.handleError<any>('updateMatches'))
    );
  }*/

  updateMatches(matchs: Match[]) {
  // Référence à la collection
    const reference = ref(firebaseDatabase, 'matchs');

    // Mettre à jour les données avec le nouveau JSON
    set(reference, matchs)
      .then(() => {
        console.log("Données mises à jour avec succès !");
      })
      .catch((error) => {
        console.error("Erreur lors de la mise à jour des données : ", error);
      });
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

      const reference = ref(firebaseDatabase, 'matchs');
      set(reference, calendar)
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
