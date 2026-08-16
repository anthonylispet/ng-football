import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard, guestGuard } from './auth/auth.guard';
import { LoginComponent } from './auth/login/login.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  {
    path: 'compteur',
    loadComponent: () => import('./league/components/life-counter/life-counter.component')
      .then(component => component.LifeCounterComponent),
  },
  {
    path: '',
    canActivate: [authGuard],
    loadChildren: () => import('./league/league.module').then(m => m.LeagueModule),
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash : true})],
  exports: [RouterModule]
})
export class AppRoutingModule {



}
