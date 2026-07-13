import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeagueComponent } from './pages/league/league.component';
import {LeagueRoutingModule} from "./league-routing.module";
import { CalendarComponent } from './components/calendar/calendar.component';
import { ClassementComponent } from './components/classement/classement.component';
import { MatchComponent } from './components/calendar/match/match.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DecksComponent } from './components/decks/decks.component';
import { LeaguesComponent } from './components/leagues/leagues.component';
import { ConfirmationDialogComponent } from './components/confirmation-dialog/confirmation-dialog.component';



@NgModule({
  declarations: [
    LeagueComponent,
    CalendarComponent,
    ClassementComponent,
    MatchComponent,
    DecksComponent,
    LeaguesComponent,
    ConfirmationDialogComponent
  ],
    imports: [
        CommonModule,
        LeagueRoutingModule,
        ReactiveFormsModule,
        FormsModule
    ]
})
export class LeagueModule { }
