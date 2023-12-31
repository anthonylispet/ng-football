import {Component, OnDestroy, OnInit} from '@angular/core';
import {League} from "../../models/class/league";
import {LeagueService} from "../../services/league.service";
import { Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-league-list',
  templateUrl: './league-list.component.html',
  styleUrls: ['./league-list.component.scss']
})
export class LeagueListComponent implements OnInit,OnDestroy{
  private destroyed$: Subject<boolean> = new Subject();

  leagues: League[]=[];

  constructor(private leagueService:LeagueService) {
  }

  leagueSelect(league:League){
    this.leagueService.selectCurrentLeague(league);
  }

  isActive(league:League): boolean {
    return this.leagueService.currentLeague?.apiId === league?.apiId ? true : false
  }

  ngOnInit(): void {
    this.leagueService.getLeagues().pipe(takeUntil(this.destroyed$)).subscribe(value => {
      this.leagues = value;
    });

  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }



}
