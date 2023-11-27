import { Injectable } from '@angular/core';
import {BehaviorSubject, map, Observable, of, Subject} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ApiLeague, Response} from "../models/api-leagues";
import {League} from "../models/league";
import {mockData} from "../models/mock.leagues"

@Injectable({
  providedIn: 'root'
})
export class FootballResultsService {

  private apiKey :string = "19332c6ea72f76eb2cd3608a1f623959"
  private apiUrl = "https://v3.football.api-sports.io/";

  leagueId: number[]= [39,140,61,78,135]

  private _currentLeague: BehaviorSubject<League|null> = new BehaviorSubject<League|null>(null);
  currentLeague$ = this._currentLeague.asObservable();


  constructor(private http:HttpClient) { }

  /*getLeagues(): Observable<League[]>{
    const headers = new HttpHeaders({
      'x-apisports-key': this.apiKey,
    });
    return this.http.get<ApiLeague>(`${this.apiUrl}/leagues?current=true`,{headers}).pipe(map( (response) => {
     return response.response.filter((response )=>  this.leagueId.includes(response.league.id))
       .map(response => new League(response.country.name,response.league.name, response.league.id,
         response.seasons.filter(season => season.current===true)[0].year));
   }));
  }*/

  selectCurrentLeague(league:League){
    this._currentLeague.next(league);
  }

  get currentLeague() :League | null {
    return this._currentLeague.getValue()
  }

  getLeagues(): Observable<League[]>{
   return of(mockData).pipe(map( (response) => {
     return response.response.filter((response )=>  this.leagueId.includes(response.league.id))
       .map(response => new League(response.country.name,response.league.name, response.league.id,
         response.seasons.filter(season => season.current===true)[0].year));
   }));
  }
}
