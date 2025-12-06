import { TestBed } from '@angular/core/testing';

import { JwtGlobalStoreService } from './jwt-global-store-service';

describe('JwtGlobalStoreService', () => {
  let service: JwtGlobalStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JwtGlobalStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
