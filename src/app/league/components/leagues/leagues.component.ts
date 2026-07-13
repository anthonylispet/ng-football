import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../auth/auth.service';
import { League } from '../../models/league';
import { getPlayerCodeFromEmail, getPlayerName, PlayerCode, Team } from '../../models/teams';
import { ConfirmationService } from '../../services/confirmation.service';
import { LeaguesService } from '../../services/leagues.service';
import { TeamsService } from '../../services/teams.service';

@Component({
  standalone: false,
  selector: 'app-leagues',
  templateUrl: './leagues.component.html',
  styleUrls: ['./leagues.component.scss'],
})
export class LeaguesComponent implements OnInit, OnDestroy {
  readonly leagueForm: FormGroup;
  leagues: League[] = [];
  teams: Team[] = [];
  selectedLeague: League | null = null;
  currentPlayer: PlayerCode | null = null;
  loading = true;
  error = '';
  busyIds = new Set<string>();
  private readonly destroyed$ = new Subject<void>();

  constructor(
    formBuilder: FormBuilder,
    private readonly authService: AuthService,
    readonly leaguesService: LeaguesService,
    private readonly teamsService: TeamsService,
    private readonly confirmationService: ConfirmationService,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {
    this.leagueForm = formBuilder.nonNullable.group({
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60)]],
    });
  }

  ngOnInit(): void {
    combineLatest([
      this.authService.user$,
      this.leaguesService.getLeagues(),
      this.leaguesService.selectedLeague$,
      this.teamsService.getTeams(),
    ]).pipe(takeUntil(this.destroyed$)).subscribe({
      next: ([user, leagues, selectedLeague, teams]) => {
        this.currentPlayer = getPlayerCodeFromEmail(user?.email);
        this.leagues = leagues;
        this.selectedLeague = selectedLeague;
        this.teams = teams;
        this.loading = false;
        this.changeDetectorRef.markForCheck();
      },
      error: error => {
        console.error('Impossible de charger les ligues.', error);
        this.error = 'Les ligues sont momentanément indisponibles.';
        this.loading = false;
      },
    });
  }

  get openLeagues(): League[] {
    return this.leagues.filter(league => league.status !== 'closed');
  }

  get closedLeagues(): League[] {
    return this.leagues.filter(league => league.status === 'closed');
  }

  get maxReached(): boolean {
    return this.openLeagues.length >= this.leaguesService.maxOpenLeagues;
  }

  async createLeague(): Promise<void> {
    if (this.leagueForm.invalid || !this.currentPlayer || this.maxReached) {
      this.leagueForm.markAllAsTouched();
      return;
    }

    this.error = '';
    try {
      await this.leaguesService.createLeague(String(this.leagueForm.value.name).trim(), this.currentPlayer);
      this.leagueForm.reset();
    } catch (error) {
      console.error('Impossible de créer la ligue.', error);
      this.error = error instanceof Error && error.message === 'MAX_OPEN_LEAGUES'
        ? 'Trois ligues sont déjà en cours. Clôturez-en une avant d’en créer une autre.'
        : 'La ligue n’a pas pu être créée.';
    }
  }

  selectableTeams(league: League): Team[] {
    if (!this.currentPlayer) return [];
    const selected = new Set(league.selectedDeckIds[this.currentPlayer]);
    return this.teams.filter(team => team.player === this.currentPlayer && (team.active || selected.has(team.id)));
  }

  isSelected(league: League, teamId: string): boolean {
    return !!this.currentPlayer && league.selectedDeckIds[this.currentPlayer].includes(teamId);
  }

  async toggleTeam(league: League, team: Team): Promise<void> {
    if (!this.currentPlayer || league.status !== 'draft' || this.isBusy(league.id)) return;
    const current = league.selectedDeckIds[this.currentPlayer];
    const adding = !current.includes(team.id);
    const next = adding ? [...current, team.id] : current.filter(id => id !== team.id);
    await this.runBusy(league.id, () => this.leaguesService.updateDeckSelection(league.id, this.currentPlayer!, next));
  }

  canStart(league: League): boolean {
    return league.status === 'draft' && league.selectedDeckIds.A.length > 0 && league.selectedDeckIds.P.length > 0;
  }

  async startLeague(league: League): Promise<void> {
    if (!this.canStart(league)) return;
    const matchCount = league.selectedDeckIds.A.length * league.selectedDeckIds.P.length;
    const confirmed = await this.confirmationService.confirm({
      title: 'Lancer le tournoi ?',
      message: `${matchCount} rencontre${matchCount > 1 ? 's seront générées' : ' sera générée'} aléatoirement, en évitant autant que possible de rejouer le même deck à la suite. Les sélections seront ensuite verrouillées.`,
      confirmLabel: 'Lancer la ligue',
    });
    if (!confirmed) return;
    await this.runBusy(league.id, () => this.leaguesService.startLeague(league, this.teams));
    this.leaguesService.selectLeague(league.id);
  }

  async closeLeague(league: League): Promise<void> {
    const confirmed = await this.confirmationService.confirm({
      title: 'Clôturer cette ligue ?',
      message: `${league.name} passera dans l’historique. Ses rencontres et son classement resteront consultables, mais plus aucun résultat ne pourra être modifié.`,
      confirmLabel: 'Clôturer',
    });
    if (!confirmed) return;
    await this.runBusy(league.id, () => this.leaguesService.closeLeague(league.id));
  }

  async deleteLeague(league: League): Promise<void> {
    const confirmed = await this.confirmationService.confirm({
      title: 'Supprimer définitivement ?',
      message: `${league.name}, ses rencontres et tous ses résultats seront effacés. Cette action est irréversible.`,
      confirmLabel: 'Supprimer la ligue',
      tone: 'danger',
    });
    if (!confirmed) return;
    await this.runBusy(league.id, () => this.leaguesService.deleteLeague(league.id));
  }

  selectLeague(id: string): void {
    this.leaguesService.selectLeague(id);
  }

  playerName(player: PlayerCode): string {
    return getPlayerName(player);
  }

  deckCount(league: League): number {
    return Object.keys(league.deckSnapshots).length;
  }

  isBusy(id: string): boolean {
    return this.busyIds.has(id);
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  private async runBusy(id: string, operation: () => Promise<void>): Promise<void> {
    this.busyIds = new Set(this.busyIds).add(id);
    this.error = '';
    try {
      await operation();
    } catch (error) {
      console.error('Impossible de modifier la ligue.', error);
      this.error = 'L’opération n’a pas pu être enregistrée.';
    } finally {
      const busy = new Set(this.busyIds);
      busy.delete(id);
      this.busyIds = busy;
      this.changeDetectorRef.markForCheck();
    }
  }
}
