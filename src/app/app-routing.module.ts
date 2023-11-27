import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: 'football-results',loadChildren: () => import('./football-results/football-results.module').then(m => m.FootballResultsModule)},
  { path: '**', redirectTo: '/football-results' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {



}
