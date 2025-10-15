import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextoH1 } from './texto-h1';

describe('TextoH1', () => {
  let component: TextoH1;
  let fixture: ComponentFixture<TextoH1>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TextoH1]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TextoH1);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
