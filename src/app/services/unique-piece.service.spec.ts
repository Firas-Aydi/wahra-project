import { TestBed } from '@angular/core/testing';

import { UniquePieceService } from './unique-piece.service';

describe('UniquePieceService', () => {
  let service: UniquePieceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UniquePieceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
