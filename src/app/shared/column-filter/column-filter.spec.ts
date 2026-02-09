import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnFilter } from './column-filter';

describe('ColumnFilter', () => {
  let component: ColumnFilter;
  let fixture: ComponentFixture<ColumnFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColumnFilter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColumnFilter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
