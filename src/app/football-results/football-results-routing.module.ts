import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {FootballResultsComponent} from "./pages/football-results/football-results.component";

const routes: Routes = [
  { path: '', component:FootballResultsComponent },
  { path:'football-results', component:FootballResultsComponent}
  //{path: 'detail/:test',  component: FootballResultsComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FootballResultsRoutingModule {



}
