import { Component } from '@angular/core';
import {LeagueService} from "../../services/league.service";

@Component({
  selector: 'app-standing',
  templateUrl: './standing.component.html',
  styleUrls: ['./standing.component.scss']
})
export class StandingComponent {

  constructor(private footService: LeagueService){}

  get currentLeague(){
    return this.footService.currentLeague$;
  }
}
