import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnionPartida } from './union-partida';

describe('UnionPartida', () => {
  let component: UnionPartida;
  let fixture: ComponentFixture<UnionPartida>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnionPartida]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnionPartida);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
