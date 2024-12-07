import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoneManagementComponent } from './stone-management.component';

describe('StoneManagementComponent', () => {
  let component: StoneManagementComponent;
  let fixture: ComponentFixture<StoneManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StoneManagementComponent]
    });
    fixture = TestBed.createComponent(StoneManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
