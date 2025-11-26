import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoraCobro } from './hora-cobro';

describe('HoraCobro', () => {
  let component: HoraCobro;
  let fixture: ComponentFixture<HoraCobro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HoraCobro]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HoraCobro);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
