import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagosDia } from './pagos-dia';

describe('PagosDia', () => {
  let component: PagosDia;
  let fixture: ComponentFixture<PagosDia>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagosDia]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagosDia);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
