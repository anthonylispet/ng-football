import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../auth/auth.service';
import { getPlayerCodeFromEmail, getPlayerName, PlayerCode, Team } from '../../models/teams';
import { ConfirmationService } from '../../services/confirmation.service';
import { TeamsService } from '../../services/teams.service';

@Component({
  standalone: false,
  selector: 'app-decks',
  templateUrl: './decks.component.html',
  styleUrls: ['./decks.component.scss'],
})
export class DecksComponent implements OnInit, OnDestroy {
  readonly deckForm: FormGroup;
  teams: Team[] = [];
  currentPlayer: PlayerCode | null = null;
  editingId: string | null = null;
  editingName = '';
  busyIds = new Set<string>();
  loading = true;
  error = '';
  private readonly destroyed$ = new Subject<void>();

  constructor(
    formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly teamsService: TeamsService,
    private readonly confirmationService: ConfirmationService,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {
    this.deckForm = formBuilder.nonNullable.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    });
  }

  ngOnInit(): void {
    combineLatest([this.authService.user$, this.teamsService.getTeams()])
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: ([user, teams]) => {
          this.currentPlayer = getPlayerCodeFromEmail(user?.email);
          this.teams = teams;
          this.loading = false;
          this.changeDetectorRef.markForCheck();
        },
        error: error => {
          console.error('Impossible de charger les decks.', error);
          this.error = 'Les decks ne peuvent pas être chargés pour le moment.';
          this.loading = false;
        },
      });
  }

  get myTeams(): Team[] {
    return this.teams.filter(team => team.player === this.currentPlayer);
  }

  get activeTeams(): Team[] {
    return this.myTeams.filter(team => team.active);
  }

  get inactiveTeams(): Team[] {
    return this.myTeams.filter(team => !team.active);
  }

  get playerName(): string {
    return this.currentPlayer ? getPlayerName(this.currentPlayer) : '';
  }

  async createTeam(): Promise<void> {
    if (this.deckForm.invalid || !this.currentPlayer) {
      this.deckForm.markAllAsTouched();
      return;
    }

    const name = String(this.deckForm.value.name).trim();
    const confirmed = await this.confirmationService.confirm({
      title: 'Ajouter ce deck ?',
      message: `« ${name} » rejoindra ta collection et pourra être sélectionné dans les prochaines ligues.`,
      confirmLabel: 'Créer le deck',
    });
    if (!confirmed) return;

    this.error = '';
    try {
      await this.teamsService.createTeam(name, this.currentPlayer);
      this.deckForm.reset();
    } catch (error) {
      console.error('Impossible de créer le deck.', error);
      this.error = 'Le deck n’a pas pu être créé.';
    }
  }

  edit(team: Team): void {
    this.editingId = team.id;
    this.editingName = team.name;
  }

  cancelEdit(): void {
    this.editingId = null;
    this.editingName = '';
  }

  async saveEdit(team: Team): Promise<void> {
    const name = this.editingName.trim();
    if (name.length < 2 || name === team.name) {
      this.cancelEdit();
      return;
    }
    const confirmed = await this.confirmationService.confirm({
      title: 'Renommer ce deck ?',
      message: `« ${team.name} » deviendra « ${name} ». Les ligues déjà lancées garderont leur nom historique.`,
      confirmLabel: 'Renommer',
    });
    if (!confirmed) return;
    await this.runBusy(team.id, () => this.teamsService.updateTeam(team.id, name));
    this.cancelEdit();
  }

  async toggleActive(team: Team): Promise<void> {
    const active = !team.active;
    const confirmed = await this.confirmationService.confirm({
      title: active ? 'Réactiver ce deck ?' : 'Mettre ce deck en réserve ?',
      message: active
        ? `« ${team.name} » pourra à nouveau être choisi dans une nouvelle ligue.`
        : `« ${team.name} » disparaîtra des nouvelles sélections, sans modifier les ligues existantes.`,
      confirmLabel: active ? 'Réactiver' : 'Désactiver',
    });
    if (!confirmed) return;
    await this.runBusy(team.id, () => this.teamsService.setTeamActive(team.id, active));
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
      console.error('Impossible de modifier le deck.', error);
      this.error = 'La modification n’a pas pu être enregistrée.';
    } finally {
      const busy = new Set(this.busyIds);
      busy.delete(id);
      this.busyIds = busy;
    }
  }
}
