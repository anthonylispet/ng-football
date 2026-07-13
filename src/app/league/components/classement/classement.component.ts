import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Classement } from '../../models/classement';
import { getPlayerName, PlayerCode } from '../../models/teams';
import { ClassementService } from '../../services/classement.service';

@Component({
  standalone: false,
  selector: 'app-classement',
  templateUrl: './classement.component.html',
  styleUrls: ['./classement.component.scss'],
})
export class ClassementComponent implements OnInit, OnDestroy {
  classement: Classement[] = [];
  loading = true;
  loadError = '';

  private readonly destroyed$ = new Subject<void>();

  constructor(
    private readonly classementService: ClassementService,
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

    this.classementService.getClassement().pipe(takeUntil(this.destroyed$)).subscribe({
      next: classement => {
        this.classement = classement;
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
