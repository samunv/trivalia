import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Aprender } from './aprender';

describe('Aprender', () => {
  let component: Aprender;
  let fixture: ComponentFixture<Aprender>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Aprender]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Aprender);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
