import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LeagueComponent} from "./pages/league/league.component";
import {CalendarComponent} from "./components/calendar/calendar.component";
import {ClassementComponent} from "./components/classement/classement.component";

const routes: Routes = [
  { path: '', component:LeagueComponent , children: [
      { path: 'calendar', component:CalendarComponent },
      { path: 'classement', component:ClassementComponent },
    ]},
  { path: '**', redirectTo :'/' }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeagueRoutingModule {



}
