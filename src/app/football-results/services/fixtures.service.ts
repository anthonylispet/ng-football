import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {CacheService} from "./cache.service";
import {catchError, map, Observable, of, throwError} from "rxjs";
import {Fixture} from "../models/class/fixture";
import {mockData} from "../models/mock.fixture";
import {ApiFixtures} from "../models/api-models/api-fixtures";

@Injectable({
  providedIn: 'root'
})
export class FixturesService {
  private apiKey :string = "19332c6ea72f76eb2cd3608a1f623959"
  private apiUrl = "https://v3.football.api-sports.io/";
  private cacheKey: string="fixture"

  constructor(private http:HttpClient,private cacheService:CacheService) { }


  getFixtures(teamId:string): Observable<Fixture[]>{
    const cachedData = this.cacheService.get(this.cacheKey + teamId)
    if (cachedData) {
      return of(cachedData) as Observable<Fixture[]>;
    } else {
      const headers = new HttpHeaders({
        'x-apisports-key': this.apiKey,
      });
      return this.http.get<ApiFixtures>(`${this.apiUrl}/fixtures?team=${teamId}&last=10`, { headers })
        .pipe(
          map(response => {
            if (response.errors.length === 0) {
              let data = response.response.map(response => new Fixture(response.teams.home, response.teams.away, response.goals));
              this.cacheService.set(this.cacheKey + teamId, data,  60 * 60 * 1000);
              return data;
            } else {
              return [];
            }
          }));
    }
  }

}
