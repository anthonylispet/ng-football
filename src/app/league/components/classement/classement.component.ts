import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Subject, takeUntil } from 'rxjs';
import { Classement } from '../../models/classement';
import { League } from '../../models/league';
import { getPlayerName, PlayerCode } from '../../models/teams';
import { ClassementService } from '../../services/classement.service';
import { LeaguesService } from '../../services/leagues.service';

interface PlayerScore {
  code: PlayerCode;
  name: string;
  victories: number;
  deckCount: number;
  leading: boolean;
}

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

  get playerScores(): PlayerScore[] {
    const scores = (['A', 'P'] as PlayerCode[]).map(code => ({
      code,
      name: getPlayerName(code),
      victories: this.classement
        .filter(standing => standing.team.player === code)
        .reduce((total, standing) => total + standing.nbVictory, 0),
      deckCount: this.classement.filter(standing => standing.team.player === code).length,
    }));
    const bestScore = Math.max(...scores.map(score => score.victories));
    const hasSingleLeader = bestScore > 0 && scores.filter(score => score.victories === bestScore).length === 1;

    return scores.map(score => ({
      ...score,
      leading: hasSingleLeader && score.victories === bestScore,
    }));
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
