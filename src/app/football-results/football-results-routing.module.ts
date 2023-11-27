import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FootballResultsComponent} from "./pages/football-results/football-results.component";
import {StandingComponent} from "./components/standing/standing.component";

const routes: Routes = [
  { path: '', component:FootballResultsComponent },
  { path:'football-results', component:FootballResultsComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FootballResultsRoutingModule {



}
