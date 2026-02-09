import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TurnoNoche } from './turno-noche';

describe('TurnoNoche', () => {
  let component: TurnoNoche;
  let fixture: ComponentFixture<TurnoNoche>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TurnoNoche]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TurnoNoche);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
