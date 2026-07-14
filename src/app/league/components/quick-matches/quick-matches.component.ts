import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../auth/auth.service';
import { DeckSelectionStatistic, QuickMatch } from '../../models/quick-match';
import { getPlayerCodeFromEmail, PlayerCode, Team } from '../../models/teams';
import { ConfirmationService } from '../../services/confirmation.service';
import { QuickMatchesService } from '../../services/quick-matches.service';
import { TeamsService } from '../../services/teams.service';
import { buildDeckSelectionStatistics } from '../../utils/quick-match-draw';

@Component({
  standalone: false,
  selector: 'app-quick-matches',
  templateUrl: './quick-matches.component.html',
  styleUrls: ['./quick-matches.component.scss'],
})
export class QuickMatchesComponent implements OnInit, OnDestroy {
  matches: QuickMatch[] = [];
  anthonyStatistics: DeckSelectionStatistic[] = [];
  pierreStatistics: DeckSelectionStatistic[] = [];
  currentPlayer: PlayerCode | null = null;
  loading = true;
  generating = false;
  loadError = '';
  actionError = '';
  savingMatchIds = new Set<string>();

  private teams: Team[] = [];
  private readonly destroyed$ = new Subject<void>();

  constructor(
    private readonly authService: AuthService,
    private readonly teamsService: TeamsService,
    private readonly quickMatchesService: QuickMatchesService,
    private readonly confirmationService: ConfirmationService,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    combineLatest([
      this.authService.user$,
      this.teamsService.getTeams(),
      this.quickMatchesService.getMatches(),
    ])
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: ([user, teams, matches]) => {
          this.currentPlayer = getPlayerCodeFromEmail(user?.email);
          this.teams = teams;
          this.matches = matches;
          this.anthonyStatistics = buildDeckSelectionStatistics(teams, matches, 'A');
          this.pierreStatistics = buildDeckSelectionStatistics(teams, matches, 'P');
          this.loading = false;
          this.loadError = '';
          this.changeDetectorRef.markForCheck();
        },
        error: error => {
          console.error('Impossible de charger les matchs rapides.', error);
          this.loading = false;
          this.loadError = 'Les matchs rapides ne peuvent pas être chargés pour le moment.';
          this.changeDetectorRef.markForCheck();
        },
      });
  }

  get latestMatch(): QuickMatch | null {
    return this.matches[0] ?? null;
  }

  get canGenerate(): boolean {
    return !!this.currentPlayer
      && this.anthonyStatistics.length > 0
      && this.pierreStatistics.length > 0;
  }

  async generateMatch(): Promise<void> {
    if (!this.canGenerate || !this.currentPlayer || this.generating) return;

    this.generating = true;
    this.actionError = '';
    try {
      await this.quickMatchesService.createMatch(this.teams, this.matches, this.currentPlayer);
    } catch (error) {
      console.error('Impossible de générer le match rapide.', error);
      this.actionError = 'Le tirage n’a pas pu être enregistré. Vérifiez votre connexion et réessayez.';
    } finally {
      this.generating = false;
      this.changeDetectorRef.markForCheck();
    }
  }

  async updateWinner(match: QuickMatch, winner: Team | null): Promise<void> {
    if (this.isSaving(match.id) || match.winner?.id === winner?.id) return;

    const confirmed = await this.confirmationService.confirm({
      title: winner ? 'Confirmer le vainqueur ?' : 'Annuler ce résultat ?',
      message: winner
        ? `« ${winner.name} » sera enregistré comme vainqueur de ce match rapide.`
        : 'Le match repassera dans les rencontres sans résultat.',
      confirmLabel: winner ? 'Enregistrer' : 'Annuler le résultat',
      tone: winner ? 'default' : 'danger',
    });
    if (!confirmed) return;

    this.actionError = '';
    this.savingMatchIds = new Set(this.savingMatchIds).add(match.id);
    try {
      await this.quickMatchesService.updateWinner(match.id, winner);
    } catch (error) {
      console.error('Impossible d’enregistrer le résultat du match rapide.', error);
      this.actionError = 'Le résultat n’a pas pu être enregistré.';
    } finally {
      const savingIds = new Set(this.savingMatchIds);
      savingIds.delete(match.id);
      this.savingMatchIds = savingIds;
      this.changeDetectorRef.markForCheck();
    }
  }

  async deleteMatch(match: QuickMatch): Promise<void> {
    if (this.isSaving(match.id)) return;

    const confirmed = await this.confirmationService.confirm({
      title: 'Supprimer ce match rapide ?',
      message: `La rencontre « ${match.teamA.name} » contre « ${match.teamP.name} » disparaîtra définitivement de l’historique et des statistiques de sélection.`,
      confirmLabel: 'Supprimer le match',
      tone: 'danger',
    });
    if (!confirmed) return;

    this.actionError = '';
    this.savingMatchIds = new Set(this.savingMatchIds).add(match.id);
    try {
      await this.quickMatchesService.deleteMatch(match.id);
    } catch (error) {
      console.error('Impossible de supprimer le match rapide.', error);
      this.actionError = 'Le match rapide n’a pas pu être supprimé.';
    } finally {
      const savingIds = new Set(this.savingMatchIds);
      savingIds.delete(match.id);
      this.savingMatchIds = savingIds;
      this.changeDetectorRef.markForCheck();
    }
  }

  isSaving(matchId: string): boolean {
    return this.savingMatchIds.has(matchId);
  }

  initials(name: string): string {
    return name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
