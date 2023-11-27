import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FootballResultsComponent } from './pages/football-results/football-results.component';
import {FootballResultsRoutingModule} from "./football-results-routing.module";
import { LeagueListComponent } from './components/league-list/league-list.component';
import { StandingComponent } from './components/standing/standing.component';



@NgModule({
  declarations: [
    FootballResultsComponent,
    LeagueListComponent,
    StandingComponent
  ],
  imports: [
    CommonModule,
    FootballResultsRoutingModule
  ]
})
export class FootballResultsModule { }
