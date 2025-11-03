import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Regalo } from './regalo';

describe('Regalo', () => {
  let component: Regalo;
  let fixture: ComponentFixture<Regalo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Regalo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Regalo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
