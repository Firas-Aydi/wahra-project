import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieceUniqueComponent } from './piece-unique.component';

describe('PieceUniqueComponent', () => {
  let component: PieceUniqueComponent;
  let fixture: ComponentFixture<PieceUniqueComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PieceUniqueComponent]
    });
    fixture = TestBed.createComponent(PieceUniqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
