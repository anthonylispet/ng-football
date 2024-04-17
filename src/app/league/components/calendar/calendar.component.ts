import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {Match} from "../../models/match";
import {CalendarService} from "../../services/calendar.service";
import {MatchComponent} from "./match/match.component";


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit,OnDestroy,AfterViewInit {
  @ViewChildren('matches') matchElements: QueryList<ElementRef>;

  matchs: Match[]=[];

  private destroyed$: Subject<boolean> = new Subject();
  constructor(private calendarService: CalendarService,private elementRef: ElementRef){}

  ngOnInit(): void {
    this.calendarService.getMatchs().pipe(takeUntil(this.destroyed$)).subscribe(matchs => {
      this.matchs = matchs;
    });

  }

  ngAfterViewInit(): void {
   /* this.matchElements.changes.pipe(takeUntil(this.destroyed$)).subscribe(() => {
      this.scrollToNextMatchWithoutWinner();
    });
    this.scrollToNextMatchWithoutWinner();*/
  }

  scrollToNextMatchWithoutWinner() {

    const matchElements = this.matchElements.toArray();
    console.log(this.matchElements.length)
    for (let i = 0; i < matchElements.length; i++) {
      console.log(this.matchs[i])
      const match = this.matchs[i];
      if (!match.winner) {
        matchElements[i].nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }
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
