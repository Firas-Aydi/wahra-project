import { TestBed } from '@angular/core/testing';

import { SousCategorieService } from './sous-categorie.service';

describe('SousCategorieService', () => {
  let service: SousCategorieService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SousCategorieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
