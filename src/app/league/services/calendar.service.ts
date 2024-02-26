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

  getMatchs(): Observable<any> {
    return this.db.object('/matchs').valueChanges();
  }

  /*updateMatches(matchs: Match[]): Observable<any> {
    console.log(matchs)
    return this.http.put('assets/matchs.json', matchs).pipe(
        catchError(this.handleError<any>('updateMatches'))
    );
  }*/

  // Gestion des erreurs
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
