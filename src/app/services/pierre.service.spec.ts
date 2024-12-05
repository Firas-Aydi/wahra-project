import { TestBed } from '@angular/core/testing';

import { PierreService } from './pierre.service';

describe('PierreService', () => {
  let service: PierreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PierreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
