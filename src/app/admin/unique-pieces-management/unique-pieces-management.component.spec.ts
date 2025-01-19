import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniquePiecesManagementComponent } from './unique-pieces-management.component';

describe('UniquePiecesManagementComponent', () => {
  let component: UniquePiecesManagementComponent;
  let fixture: ComponentFixture<UniquePiecesManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UniquePiecesManagementComponent]
    });
    fixture = TestBed.createComponent(UniquePiecesManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
