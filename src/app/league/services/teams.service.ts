import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, Observable, of} from "rxjs";
import {Team} from "../models/teams";
import {AngularFireDatabase} from "@angular/fire/compat/database";
import {initializeApp} from "@angular/fire/app";



@Injectable({
  providedIn: 'root'
})
export class TeamsService {

  private jsonUrl = "assets/teams.json"
  constructor(private http: HttpClient,private db: AngularFireDatabase) {}

  getTeams(): Observable<Team[]> {
    return this.db.object('/teams').valueChanges() as Observable<Team[]>;
  }

  /*resetTeams(){
    const reference = this.db.object("/teams");

    this.http.get(this.jsonUrl).subscribe(teams => {
      reference.set(teams)
        .then(() => {
          console.log("Données mises à jour avec succès !");
        })
        .catch((error) => {
          console.error("Erreur lors de la mise à jour des données : ", error);
        });
    });
  }*/

}
