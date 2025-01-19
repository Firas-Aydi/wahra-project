import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewsManagementComponent } from './news-management.component';

describe('NewsManagementComponent', () => {
  let component: NewsManagementComponent;
  let fixture: ComponentFixture<NewsManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewsManagementComponent]
    });
    fixture = TestBed.createComponent(NewsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
