import {Component, OnInit} from '@angular/core';
import {TeamsService} from "../../services/teams.service";
import {CalendarService} from "../../services/calendar.service";
import {Router} from "@angular/router";
import {AuthService} from "../../../auth/auth.service";

@Component({
  standalone: false,
  selector: 'app-league',
  templateUrl: './league.component.html',
  styleUrls: ['./league.component.scss']
})
export class LeagueComponent implements OnInit{

  constructor(
    private calendarService:CalendarService,
    private teamsService:TeamsService,
    readonly authService: AuthService,
    private readonly router: Router,
  ){}

  ngOnInit(): void {
    //this.teamsService.resetTeams();
    //this.calendarService.resetCalendar();
  }

  async logout(): Promise<void> {
    await this.authService.logout();
    await this.router.navigate(['/login']);
  }

}
