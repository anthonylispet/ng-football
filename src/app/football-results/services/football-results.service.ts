import { Injectable } from '@angular/core';
import {map, Observable, of} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ApiLeague, Response} from "../models/api-leagues";
import {League} from "../models/league";
import {mockData} from "../models/test"

@Injectable({
  providedIn: 'root'
})
export class FootballResultsService {

  private apiKey :string = "19332c6ea72f76eb2cd3608a1f623959"
  private apiUrl = "https://v3.football.api-sports.io/";

  leagueId: number[]= [39,140,61,78,135]

  constructor(private http:HttpClient) { }

  /*getCurrentSeason(): Observable<League[]>{
    const headers = new HttpHeaders({
      'x-apisports-key': this.apiKey,
    });
    return this.http.get<ApiLeague>(`${this.apiUrl}/leagues?current=true`,{headers}).pipe(map( (response) => {
      return response.response.filter((response)=>  this.leagueId.includes(response.league.id))
        .map((response) => ({
          country: response.country.name,
          name: response.league.name,
          apiId: response.league.id,
          currentSeason: response.seasons.filter(season => season.current === true)[0].year
        } as League));
    }));
  }*/

  getCurrentSeason(): Observable<League[]>{
   return of(mockData).pipe(map( (response) => {
     return response.response.filter((response)=>  this.leagueId.includes(response.league.id))
                             .map((response) => ({
       country: response.country.name,
       name: response.league.name,
       apiId: response.league.id,
       currentSeason: response.seasons.filter(season => season.current === true)[0].year
     } as League));
   }));
  }
}
