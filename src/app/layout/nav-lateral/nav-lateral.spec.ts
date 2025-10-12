import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavLateral } from './nav-lateral';

describe('NavLateral', () => {
  let component: NavLateral;
  let fixture: ComponentFixture<NavLateral>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavLateral]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavLateral);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
