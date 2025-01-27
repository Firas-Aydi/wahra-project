import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvisManagementComponent } from './avis-management.component';

describe('AvisManagementComponent', () => {
  let component: AvisManagementComponent;
  let fixture: ComponentFixture<AvisManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AvisManagementComponent]
    });
    fixture = TestBed.createComponent(AvisManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
