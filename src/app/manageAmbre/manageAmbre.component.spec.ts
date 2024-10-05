import { ComponentFixture, TestBed } from '@angular/core/testing';

import { manageAmbreComponent } from './manageAmbre.component';

describe('manageAmbreComponent', () => {
  let component: manageAmbreComponent;
  let fixture: ComponentFixture<manageAmbreComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [manageAmbreComponent]
    });
    fixture = TestBed.createComponent(manageAmbreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
