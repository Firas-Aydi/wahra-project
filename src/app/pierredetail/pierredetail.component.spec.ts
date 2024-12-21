import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BienfaitsComponent } from './pierredetail.component';

describe('BienfaitsComponent', () => {
  let component: BienfaitsComponent;
  let fixture: ComponentFixture<BienfaitsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BienfaitsComponent]
    });
    fixture = TestBed.createComponent(BienfaitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
