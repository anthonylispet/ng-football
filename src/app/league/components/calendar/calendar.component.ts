import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Match } from '../../models/match';
import { League } from '../../models/league';
import { Team } from '../../models/teams';
import { CalendarService } from '../../services/calendar.service';
import { ConfirmationService } from '../../services/confirmation.service';
import { LeaguesService } from '../../services/leagues.service';

type MatchFilter = 'all' | 'pending' | 'completed';

@Component({
  standalone: false,
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit, OnDestroy {
  matches: Match[] = [];
  league: League | null = null;
  filter: MatchFilter = 'all';
  searchTerm = '';
  loading = true;
  loadError = '';
  saveError = '';
  savingMatchIds = new Set<string>();

  private readonly destroyed$ = new Subject<void>();

  constructor(
    private readonly calendarService: CalendarService,
    private readonly leaguesService: LeaguesService,
    private readonly confirmationService: ConfirmationService,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadMatches();
  }

  get completedGames(): number {
    return this.matches.filter(match => match.winner !== null).length;
  }

  get pendingGames(): number {
    return this.matches.length - this.completedGames;
  }

  get completionPercentage(): number {
    return this.matches.length ? Math.round((this.completedGames / this.matches.length) * 100) : 0;
  }

  get filteredMatches(): Match[] {
    let filteredMatches = this.matches;

    if (this.filter === 'pending') {
      filteredMatches = filteredMatches.filter(match => match.winner === null);
    }

    if (this.filter === 'completed') {
      filteredMatches = filteredMatches.filter(match => match.winner !== null);
    }

    const query = this.normalizeSearchValue(this.searchTerm);
    if (!query) {
      return filteredMatches;
    }

    return filteredMatches.filter(match =>
      this.normalizeSearchValue(match.team1.name).includes(query)
      || this.normalizeSearchValue(match.team2.name).includes(query),
    );
  }

  setFilter(filter: MatchFilter): void {
    this.filter = filter;
  }

  clearSearch(): void {
    this.searchTerm = '';
  }

  isSaving(matchId: string): boolean {
    return this.savingMatchIds.has(matchId);
  }

  async updateWinner(matchId: string, winner: Team | null): Promise<void> {
    if (!this.league || this.league.status !== 'active') return;
    const leagueId = this.league.id;
    const matchIndex = this.matches.findIndex(match => match.matchId === matchId);
    if (matchIndex === -1 || this.isSaving(matchId)) {
      return;
    }

    const previousWinner = this.matches[matchIndex].winner;
    const confirmed = await this.confirmationService.confirm({
      title: winner ? 'Confirmer le vainqueur ?' : 'Annuler ce résultat ?',
      message: winner
        ? `« ${winner.name} » sera enregistré comme vainqueur de cette rencontre.`
        : 'La rencontre repassera dans les parties à jouer.',
      confirmLabel: winner ? 'Enregistrer' : 'Annuler le résultat',
      tone: winner ? 'default' : 'danger',
    });
    if (!confirmed) return;
    this.matches = this.matches.map((match, index) =>
      index === matchIndex ? { ...match, winner } : match,
    );
    this.saveError = '';
    this.savingMatchIds = new Set(this.savingMatchIds).add(matchId);

    try {
      await this.calendarService.updateWinner(leagueId, matchId, winner);
    } catch (error) {
      console.error('Impossible d’enregistrer le résultat.', error);
      this.matches = this.matches.map((match, index) =>
        index === matchIndex ? { ...match, winner: previousWinner } : match,
      );
      this.saveError = 'Le résultat n’a pas pu être enregistré. Vérifiez votre connexion et réessayez.';
    } finally {
      const savingIds = new Set(this.savingMatchIds);
      savingIds.delete(matchId);
      this.savingMatchIds = savingIds;
      this.changeDetectorRef.markForCheck();
    }
  }

  retry(): void {
    this.loadMatches();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  private loadMatches(): void {
    this.loading = true;
    this.loadError = '';

    this.leaguesService.selectedLeague$.pipe(takeUntil(this.destroyed$)).subscribe({
      next: league => {
        this.league = league;
        this.matches = league?.matches ?? [];
        this.loading = false;
        this.changeDetectorRef.markForCheck();
      },
      error: error => {
        console.error('Impossible de charger les parties.', error);
        this.loading = false;
        this.loadError = 'Les parties sont momentanément indisponibles.';
        this.changeDetectorRef.markForCheck();
      },
    });
  }

  private normalizeSearchValue(value: string): string {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }
}
