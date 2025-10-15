import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MensajeAlerta } from './mensaje-alerta';

describe('MensajeAlerta', () => {
  let component: MensajeAlerta;
  let fixture: ComponentFixture<MensajeAlerta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MensajeAlerta]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MensajeAlerta);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
