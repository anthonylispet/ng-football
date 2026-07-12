import { beforeEach, describe, expect, it } from "vitest";
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarakiRandomComponent } from './baraki-random.component';
import { FootballResultsModule } from '../../football-results.module';

describe('BarakiRandomComponent', () => {
    let component: BarakiRandomComponent;
    let fixture: ComponentFixture<BarakiRandomComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
      imports: [FootballResultsModule]
        });
        fixture = TestBed.createComponent(BarakiRandomComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
