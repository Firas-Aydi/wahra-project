import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProposComponent } from './propos.component';

describe('ProposComponent', () => {
  let component: ProposComponent;
  let fixture: ComponentFixture<ProposComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProposComponent]
    });
    fixture = TestBed.createComponent(ProposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
