import {Component, OnInit} from '@angular/core';
import {TeamsService} from "../../services/teams.service";
import {CalendarService} from "../../services/calendar.service";

@Component({
  selector: 'app-league',
  templateUrl: './league.component.html',
  styleUrls: ['./league.component.scss']
})
export class LeagueComponent implements OnInit{

  constructor(private calendarService:CalendarService,private teamsService:TeamsService){}

  ngOnInit(): void {
    //this.teamsService.resetTeams();
    //this.calendarService.resetCalendar();
  }

}
