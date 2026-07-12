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
});
