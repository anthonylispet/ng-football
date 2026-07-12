import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {Team} from "../models/teams";
import { onValue, ref } from 'firebase/database';
import { firebaseDatabase } from '../../firebase';



@Injectable({
  providedIn: 'root'
})
export class TeamsService {

  getTeams(): Observable<Team[]> {
    return new Observable<Team[]>(subscriber =>
      onValue(
        ref(firebaseDatabase, 'teams'),
        snapshot => subscriber.next(snapshot.val() ?? []),
        error => subscriber.error(error)
      )
    );
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
