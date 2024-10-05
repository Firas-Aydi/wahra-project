import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmbreComponent } from './ambre.component';

describe('AmbreComponent', () => {
  let component: AmbreComponent;
  let fixture: ComponentFixture<AmbreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AmbreComponent]
    });
    fixture = TestBed.createComponent(AmbreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
