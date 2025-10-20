import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Espacio } from './espacio';

describe('Espacio', () => {
  let component: Espacio;
  let fixture: ComponentFixture<Espacio>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Espacio]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Espacio);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
