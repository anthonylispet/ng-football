import {Component, OnDestroy, OnInit} from '@angular/core';
import {LeagueService} from "../../services/league.service";
import {Observable, Subject, takeUntil} from "rxjs";
import {StandingsService} from "../../services/standings.service";
import {Standing} from "../../models/class/standing";

@Component({
  selector: 'app-standing',
  templateUrl: './standing.component.html',
  styleUrls: ['./standing.component.scss']
})
export class StandingComponent implements OnInit,OnDestroy{

  private destroyed$: Subject<boolean> = new Subject();

  constructor(private leagueService: LeagueService,private standingService:StandingsService){}

  get currentStanding(): Observable<Standing[] | null>{
    return this.standingService.currentStanding$;
  }

  ngOnInit(): void {
    this.leagueService.currentLeague$.pipe(takeUntil(this.destroyed$)).subscribe(league => {
      if (league) {
        this.standingService.getStandings(league).pipe(takeUntil(this.destroyed$)).subscribe(value => {
          this.standingService.setCurrentStanding(value);
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
