import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Match } from '../../models/match';
import { Team } from '../../models/teams';
import { CalendarService } from '../../services/calendar.service';

type MatchFilter = 'all' | 'pending' | 'completed';

@Component({
  standalone: false,
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit, OnDestroy {
  matches: Match[] = [];
  filter: MatchFilter = 'all';
  loading = true;
  loadError = '';
  saveError = '';
  savingMatchIds = new Set<number>();

  private readonly destroyed$ = new Subject<void>();

  constructor(
    private readonly calendarService: CalendarService,
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
    if (this.filter === 'pending') {
      return this.matches.filter(match => match.winner === null);
    }

    if (this.filter === 'completed') {
      return this.matches.filter(match => match.winner !== null);
    }

    return this.matches;
  }

  setFilter(filter: MatchFilter): void {
    this.filter = filter;
  }

  isSaving(matchId: number): boolean {
    return this.savingMatchIds.has(matchId);
  }

  async updateWinner(matchId: number, winner: Team | null): Promise<void> {
    const matchIndex = this.matches.findIndex(match => match.matchId === matchId);
    if (matchIndex === -1 || this.isSaving(matchId)) {
      return;
    }

    const previousWinner = this.matches[matchIndex].winner;
    this.matches = this.matches.map((match, index) =>
      index === matchIndex ? { ...match, winner } : match,
    );
    this.saveError = '';
    this.savingMatchIds = new Set(this.savingMatchIds).add(matchId);

    try {
      await this.calendarService.updateWinner(matchIndex, winner);
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

    this.calendarService.getMatchs().pipe(takeUntil(this.destroyed$)).subscribe({
      next: matches => {
        this.matches = matches;
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
}
