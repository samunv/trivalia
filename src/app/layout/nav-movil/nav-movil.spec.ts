import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavMovil } from './nav-movil';

describe('NavMovil', () => {
  let component: NavMovil;
  let fixture: ComponentFixture<NavMovil>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavMovil]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavMovil);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
