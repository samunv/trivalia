import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotonGeneral } from './boton-general';

describe('BotonGeneral', () => {
  let component: BotonGeneral;
  let fixture: ComponentFixture<BotonGeneral>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotonGeneral]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BotonGeneral);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
