import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreguntaIa } from './pregunta-ia';

describe('PreguntaIa', () => {
  let component: PreguntaIa;
  let fixture: ComponentFixture<PreguntaIa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreguntaIa]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreguntaIa);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
