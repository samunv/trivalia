import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinPartida } from './fin-partida';

describe('FinPartida', () => {
  let component: FinPartida;
  let fixture: ComponentFixture<FinPartida>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinPartida]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinPartida);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
