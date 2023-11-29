import { Injectable } from '@angular/core';
import {BehaviorSubject, map, Observable, of} from "rxjs";
import {League} from "../models/league";
import {Standing} from "../models/standing";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CacheService} from "./cache.service";
import {ApiStandings} from "../models/api-models/api-standings";
import {mockData} from "../models/mock.standings"

@Injectable({
  providedIn: 'root'
})
export class StandingsService {
  private apiKey :string = "19332c6ea72f76eb2cd3608a1f623959"
  private apiUrl = "https://v3.football.api-sports.io/";
  private cacheKey="standings"

  // @ts-ignore
  private _currentStanding: BehaviorSubject<Standing[]> = new BehaviorSubject<Standing[]>(null);
  currentStanding$ = this._currentStanding.asObservable();

  constructor(private http:HttpClient,private cacheService:CacheService) { }

  getStandings(league:League): Observable<Standing[]>{
      const cachedData = this.cacheService.get(this.cacheKey + league?.apiId)
      if (cachedData) {
        return of(cachedData) as Observable<Standing[]>;
      } else {
        const headers = new HttpHeaders({
          'x-apisports-key': this.apiKey,
        });

        return this.http.get<ApiStandings>(`${this.apiUrl}/standings?league=${league.apiId}&season=${league.currentSeason}`, {headers})
          .pipe(map(response => {
            let data = response.response[0].league.standings[0].map(apiStanding => new Standing(apiStanding));
            console.log(data);
            this.cacheService.set(this.cacheKey + league.apiId, data, 24 * 60 * 60 * 1000);
            return data;
          }));
      }

  }


  /*getStandings(league:League): Observable<Standing[]>{
    const cachedData = this.cacheService.get(this.cacheKey + league?.apiId)
    if (cachedData) {
      return of(cachedData) as Observable<Standing[]>;
    } else {

      return of(mockData).pipe(map(response => {
        // @ts-ignore
        let r = response as ApiStandings;
        let data = r.response[0].league.standings[0].map(apiStanding => new Standing(apiStanding));

        this.cacheService.set(this.cacheKey + league.apiId, data, 24 * 60 * 60 * 1000);
        return data;
      }));
    }

  }*/

  setCurrentStanding(standing:Standing[]){
    this._currentStanding.next(standing);
  }
}
