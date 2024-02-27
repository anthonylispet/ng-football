import {Component, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, Observable, Subject, takeUntil} from "rxjs";
import {Match} from "../../models/match";
import {CalendarService} from "../../services/calendar.service";
import {Standing} from "../../../football-results/models/class/standing";
import {FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Team} from "../../models/teams";
import {TeamsService} from "../../services/teams.service";


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit,OnDestroy {

  matchs: Match[]=[];
  teams:Team[]=[]
  calendarForm!: FormGroup;

  private destroyed$: Subject<boolean> = new Subject();
  constructor(private teamsService:TeamsService,private calendarService: CalendarService,private fb: FormBuilder){}

  ngOnInit(): void {
    this.calendarService.getMatchs().pipe(takeUntil(this.destroyed$)).subscribe(matchs => {
      this.matchs = matchs;
    });
  }

  updateWinner(matchIndex: number, winner: any): void {
    console.log(winner)
    this.matchs[matchIndex].winner = winner;

    this.calendarService.updateMatches(this.matchs);
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
