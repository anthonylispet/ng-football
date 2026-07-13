import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LeagueComponent} from "./pages/league/league.component";
import {CalendarComponent} from "./components/calendar/calendar.component";
import {ClassementComponent} from "./components/classement/classement.component";
import { DecksComponent } from './components/decks/decks.component';
import { LeaguesComponent } from './components/leagues/leagues.component';

const routes: Routes = [
  { path: '', component:LeagueComponent , children: [
      { path: '', redirectTo: 'parties', pathMatch: 'full' },
      { path: 'parties', component:CalendarComponent },
      { path: 'calendar', redirectTo: 'parties' },
      { path: 'classement', component:ClassementComponent },
      { path: 'decks', component: DecksComponent },
      { path: 'ligues', component: LeaguesComponent },
    ]},
  { path: '**', redirectTo :'/' }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeagueRoutingModule {



}
