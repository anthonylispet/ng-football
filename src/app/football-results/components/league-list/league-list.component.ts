import {Component, OnDestroy, OnInit} from '@angular/core';
import {League} from "../../models/league";
import {FootballResultsService} from "../../services/football-results.service";
import { Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-league-list',
  templateUrl: './league-list.component.html',
  styleUrls: ['./league-list.component.scss']
})
export class LeagueListComponent implements OnInit,OnDestroy{
  private destroyed$: Subject<boolean> = new Subject();

  leagues: League[]=[];

  constructor(private footService:FootballResultsService) {
  }

  leagueSelected(league:League){
    this.footService.selectCurrentLeague(league);
  }

  ngOnInit(): void {
    this.footService.getLeagues().pipe(takeUntil(this.destroyed$)).subscribe(value => {
      this.leagues = value;
    });

  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }



}
