import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';
import { LeaguesService } from '../../services/leagues.service';

@Component({
  standalone: false,
  selector: 'app-league',
  templateUrl: './league.component.html',
  styleUrls: ['./league.component.scss']
})
export class LeagueComponent {

  constructor(
    readonly authService: AuthService,
    readonly leaguesService: LeaguesService,
    private readonly router: Router,
  ){}

  selectLeague(event: Event): void {
    this.leaguesService.selectLeague((event.target as HTMLSelectElement).value);
  }

  async logout(): Promise<void> {
    await this.authService.logout();
    await this.router.navigate(['/login']);
  }

}
