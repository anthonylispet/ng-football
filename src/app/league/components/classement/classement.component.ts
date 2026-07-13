import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import { Classement } from '../../models/classement';
import { League } from '../../models/league';
import { getPlayerName, PlayerCode } from '../../models/teams';
import { ClassementService } from '../../services/classement.service';
import { LeaguesService } from '../../services/leagues.service';

@Component({
  standalone: false,
  selector: 'app-classement',
  templateUrl: './classement.component.html',
  styleUrls: ['./classement.component.scss'],
})
export class ClassementComponent implements OnInit, OnDestroy {
  classement: Classement[] = [];
  league: League | null = null;
  loading = true;
  loadError = '';

  private readonly destroyed$ = new Subject<void>();

  constructor(
    private readonly classementService: ClassementService,
    private readonly leaguesService: LeaguesService,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadClassement();
  }

  get podium(): Classement[] {
    return this.classement.slice(0, 3);
  }

  get totalGamesPlayed(): number {
    return this.classement.reduce((total, standing) => total + standing.nbVictory, 0);
  }

  playerName(player: PlayerCode): string {
    return getPlayerName(player);
  }

  retry(): void {
    this.loadClassement();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  private loadClassement(): void {
    this.loading = true;
    this.loadError = '';

    combineLatest([this.classementService.getClassement(), this.leaguesService.selectedLeague$]).pipe(takeUntil(this.destroyed$)).subscribe({
      next: ([classement, league]) => {
        this.classement = classement;
        this.league = league;
        this.loading = false;
        this.changeDetectorRef.markForCheck();
      },
      error: error => {
        console.error('Impossible de charger le classement.', error);
        this.loading = false;
        this.loadError = 'Le classement ne peut pas être calculé pour le moment.';
        this.changeDetectorRef.markForCheck();
      },
    });
  }
}
