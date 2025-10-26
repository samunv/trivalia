import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaPreguntas } from './pagina-preguntas';

describe('PaginaPreguntas', () => {
  let component: PaginaPreguntas;
  let fixture: ComponentFixture<PaginaPreguntas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginaPreguntas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginaPreguntas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
