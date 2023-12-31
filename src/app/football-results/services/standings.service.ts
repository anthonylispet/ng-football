import { Injectable } from '@angular/core';
import {BehaviorSubject, catchError, map, Observable, of} from "rxjs";
import {League} from "../models/class/league";
import {Standing} from "../models/class/standing";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CacheService} from "./cache.service";
import {ApiStandings} from "../models/api-models/api-standings";
import {ErrorService} from "./error.service";

@Injectable({
  providedIn: 'root'
})
export class StandingsService {
  private apiKey :string = "19332c6ea72f76eb2cd3608a1f623959"
  private apiUrl = "https://v3.football.api-sports.io/";
  private cacheKey="standings"

  // @ts-ignore
  private _currentStanding: BehaviorSubject<Standing[] | null> = new BehaviorSubject<Standing[]>(null);
  currentStanding$ = this._currentStanding.asObservable();

  constructor(private http:HttpClient,private cacheService:CacheService,private errorService:ErrorService) { }

  getStandings(league:League): Observable<Standing[]>{
      this.errorService.flush();
      const cachedData = this.cacheService.get(this.cacheKey + league?.apiId)
      if (cachedData) {
        return of(cachedData) as Observable<Standing[]>;
      } else {
        const headers = new HttpHeaders({
          'x-apisports-key': this.apiKey,
        });

          return this.http.get<ApiStandings>(`${this.apiUrl}/standings?league=${league.apiId}&season=${league.currentSeason}`, {headers})
              .pipe(map(response => {
                      if (response.errors.length === 0) {
                          let data = response.response[0].league.standings[0].sort((a, b) => b.rank + a.rank).map(apiStanding => new Standing(apiStanding));
                          this.cacheService.set(this.cacheKey + league.apiId, data,  60 * 60 * 1000);
                          return data;
                      } else {
                          const firstKey = Object.values(response.errors);
                          throw new Error( firstKey[0] ?? 'Unknown Error');
                      }
                  }),
                  catchError(error => {
                      this.errorService.setCurrentError(error);
                      this.setCurrentStanding(null);
                      return [] ;
                  }));
      }

  }

  setCurrentStanding(standing:Standing[] |null){
    this._currentStanding.next(standing);
  }
}
