import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreJuego } from './pre-juego';

describe('PreJuego', () => {
  let component: PreJuego;
  let fixture: ComponentFixture<PreJuego>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreJuego]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreJuego);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
