import { TestBed } from '@angular/core/testing';

import { CategoriaGlobalStoreService } from './categoria-global-store-service';

describe('CategoriaGlobalStoreService', () => {
  let service: CategoriaGlobalStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoriaGlobalStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
