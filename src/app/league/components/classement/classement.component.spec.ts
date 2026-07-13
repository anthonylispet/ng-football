import { beforeEach, describe, expect, it } from "vitest";
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassementComponent } from './classement.component';
import { LeagueModule } from '../../league.module';

describe('ClassementComponent', () => {
    let component: ClassementComponent;
    let fixture: ComponentFixture<ClassementComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
      imports: [LeagueModule]
        });
        fixture = TestBed.createComponent(ClassementComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should aggregate victories by player across their decks', () => {
        component.classement = [
            {
                team: { id: 'edgar', name: 'Edgar Markov', player: 'A', active: true, createdAt: 1, updatedAt: 1 },
                nbPlayed: 3,
                nbVictory: 2,
            },
            {
                team: { id: 'ixhel', name: 'Ixhel', player: 'A', active: true, createdAt: 1, updatedAt: 1 },
                nbPlayed: 2,
                nbVictory: 1,
            },
            {
                team: { id: 'otrimi', name: 'Otrimi', player: 'P', active: true, createdAt: 1, updatedAt: 1 },
                nbPlayed: 3,
                nbVictory: 1,
            },
        ];

        expect(component.playerScores).toEqual([
            { code: 'A', name: 'Anthony', victories: 3, deckCount: 2, leading: true },
            { code: 'P', name: 'Pierre', victories: 1, deckCount: 1, leading: false },
        ]);
    });
});
