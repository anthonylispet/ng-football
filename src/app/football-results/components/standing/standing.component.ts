import { Component } from '@angular/core';
import {FootballResultsService} from "../../services/football-results.service";

@Component({
  selector: 'app-standing',
  templateUrl: './standing.component.html',
  styleUrls: ['./standing.component.scss']
})
export class StandingComponent {

  constructor(private footService: FootballResultsService){}

  get currentLeague(){
    return this.footService.currentLeague$;
  }
}
