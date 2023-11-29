import { Injectable } from '@angular/core';
import {BehaviorSubject, catchError, map, Observable, of, Subject} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {ApiLeague, Response} from "../models/api-models/api-leagues";
import {League} from "../models/class/league";
import {CacheService} from "./cache.service";
import {ErrorService} from "./error.service";

@Injectable({
  providedIn: 'root'
})
export class LeagueService {

  private apiKey :string = "19332c6ea72f76eb2cd3608a1f623959"
  private apiUrl = "https://v3.football.api-sports.io/";
  private cacheKey="league"
  leagueId: number[]= [39,140,61,78,135]

  // @ts-ignore
  private _currentLeague: BehaviorSubject<League> = new BehaviorSubject<League>(null);
  currentLeague$ = this._currentLeague.asObservable();


  constructor(private http:HttpClient,private cacheService:CacheService,private errorService:ErrorService) { }

  getLeagues(): Observable<League[]>{
    this.errorService.flush();
    const cachedData = this.cacheService.get(this.cacheKey)
    if (cachedData) {
      return of(cachedData) as Observable<League[]>;
    }else {
      const headers = new HttpHeaders({
        'x-apisports-key': this.apiKey,
      });

      return this.http.get<ApiLeague>(`${this.apiUrl}/leagues?current=true`,{headers}).pipe(map( (response :ApiLeague) => {

        if (response.errors.length === 0) {
          let data = response.response.filter((response) => this.leagueId.includes(response.league.id))
            .map(response => new League(response.country.name, response.league.name, response.league.id,
              response.seasons.filter(season => season.current === true)[0].year));
          this.cacheService.set(this.cacheKey, data, 24 * 60 * 60 * 1000);
          return data
        } else {
          const firstKey = Object.values(response.errors);
          throw new Error( firstKey[0] ?? 'Unknown Error');
        }
      },
          catchError(error => {
            this.errorService.setCurrentError(error);
            return [] ;
          })));
    }
  }

  selectCurrentLeague(league:League){
    this._currentLeague.next(league);
  }

  get currentLeague() :League  {
    return this._currentLeague.getValue()
  }

}
