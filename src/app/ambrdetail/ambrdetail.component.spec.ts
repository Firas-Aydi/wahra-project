import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmbrdetailComponent } from './ambrdetail.component';

describe('AmbrdetailComponent', () => {
  let component: AmbrdetailComponent;
  let fixture: ComponentFixture<AmbrdetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AmbrdetailComponent]
    });
    fixture = TestBed.createComponent(AmbrdetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
