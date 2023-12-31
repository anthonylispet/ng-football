import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarakiRandomComponent } from './baraki-random.component';

describe('BarakiRandomComponent', () => {
  let component: BarakiRandomComponent;
  let fixture: ComponentFixture<BarakiRandomComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BarakiRandomComponent]
    });
    fixture = TestBed.createComponent(BarakiRandomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
