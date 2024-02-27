import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Team} from "../models/teams";
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {initializeApp} from "@angular/fire/app";



@Injectable({
  providedIn: 'root'
})
export class TeamsService {


  constructor(private db: AngularFireDatabase) {}

  getTeams(): Observable<Team[]> {
    return this.db.object('/teams').valueChanges() as Observable<Team[]>;
  }
}
