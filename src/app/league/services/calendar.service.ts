import { Injectable } from '@angular/core';
import {Match} from "../models/match";
import {BehaviorSubject, catchError, Observable, of} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Standing} from "../../football-results/models/class/standing";
import {AngularFireDatabase} from "@angular/fire/compat/database";

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  constructor(private http: HttpClient,private db: AngularFireDatabase) { }

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
}
