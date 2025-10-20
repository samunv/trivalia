import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPreguntas } from './form-preguntas';

describe('FormPreguntas', () => {
  let component: FormPreguntas;
  let fixture: ComponentFixture<FormPreguntas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormPreguntas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormPreguntas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
