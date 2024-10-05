import { TestBed } from '@angular/core/testing';

import { AmbreService } from './ambre.service';

describe('AmbreService', () => {
  let service: AmbreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AmbreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
