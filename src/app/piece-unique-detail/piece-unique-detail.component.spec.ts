import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieceUniqueDetailComponent } from './piece-unique-detail.component';

describe('PieceUniqueDetailComponent', () => {
  let component: PieceUniqueDetailComponent;
  let fixture: ComponentFixture<PieceUniqueDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PieceUniqueDetailComponent]
    });
    fixture = TestBed.createComponent(PieceUniqueDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
