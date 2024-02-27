import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {Match} from "../../models/match";
import {CalendarService} from "../../services/calendar.service";


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit,OnDestroy {

  matchs: Match[]=[];

  private destroyed$: Subject<boolean> = new Subject();
  constructor(private calendarService: CalendarService){}

  ngOnInit(): void {
    this.calendarService.getMatchs().pipe(takeUntil(this.destroyed$)).subscribe(matchs => {
      this.matchs = matchs;
    });
  }

  updateWinner(matchIndex: number, winner: any): void {
    this.matchs[matchIndex].winner = winner;
    this.calendarService.updateMatches(this.matchs);
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
