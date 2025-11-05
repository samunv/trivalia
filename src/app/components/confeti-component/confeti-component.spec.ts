import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfetiComponent } from './confeti-component';

describe('ConfetiComponent', () => {
  let component: ConfetiComponent;
  let fixture: ComponentFixture<ConfetiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfetiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfetiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
