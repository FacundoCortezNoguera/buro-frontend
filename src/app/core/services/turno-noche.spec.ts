import { TestBed } from '@angular/core/testing';

import { TurnoNocheService } from './turno-noche';

describe('TurnoNoche', () => {
  let service: TurnoNocheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TurnoNocheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
