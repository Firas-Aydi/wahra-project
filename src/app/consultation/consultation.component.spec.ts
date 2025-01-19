import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationComponent } from './consultation.component';

describe('ConsultationComponent', () => {
  let component: ConsultationComponent;
  let fixture: ComponentFixture<ConsultationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConsultationComponent]
    });
    fixture = TestBed.createComponent(ConsultationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
