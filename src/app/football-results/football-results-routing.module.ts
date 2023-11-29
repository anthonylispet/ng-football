import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FootballResultsComponent} from "./pages/football-results/football-results.component";
import {StandingComponent} from "./components/standing/standing.component";
import {FixturesComponent} from "./components/fixtures/fixtures.component";

const routes: Routes = [
  { path: '', component:FootballResultsComponent },
  { path: 'fixtures/:teamId', component:FixturesComponent },
  { path: '**', redirectTo :'' }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FootballResultsRoutingModule {



}
