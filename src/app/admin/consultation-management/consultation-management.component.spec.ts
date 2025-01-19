import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationManagementComponent } from './consultation-management.component';

describe('ConsultationManagementComponent', () => {
  let component: ConsultationManagementComponent;
  let fixture: ComponentFixture<ConsultationManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConsultationManagementComponent]
    });
    fixture = TestBed.createComponent(ConsultationManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
