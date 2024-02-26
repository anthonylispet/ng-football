import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LeagueComponent} from "./pages/league/league.component";

const routes: Routes = [
  { path: '', component:LeagueComponent },
  { path: '**', redirectTo :'/' }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LeagueRoutingModule {



}
