import {Component, OnInit} from '@angular/core';
import {League} from "../../models/league";
import {FootballResultsService} from "../../services/football-results.service";

@Component({
  selector: 'app-league-list',
  templateUrl: './league-list.component.html',
  styleUrls: ['./league-list.component.scss']
})
export class LeagueListComponent implements OnInit{


  leagues: League[]=[];

  constructor(private footService:FootballResultsService) {
  }

  ngOnInit(): void {
    this.footService.getCurrentSeason().subscribe(value => {
      console.log(value)
      this.leagues = value;
    });

  }


}
