import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeagueComponent } from './pages/league/league.component';
import {LeagueRoutingModule} from "./league-routing.module";
import { CalendarComponent } from './components/calendar/calendar.component';
import { ClassementComponent } from './components/classement/classement.component';
import { MatchComponent } from './components/calendar/match/match.component';
import {ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    LeagueComponent,
    CalendarComponent,
    ClassementComponent,
    MatchComponent
  ],
    imports: [
        CommonModule,
        LeagueRoutingModule,
        ReactiveFormsModule
    ]
})
export class LeagueModule { }
