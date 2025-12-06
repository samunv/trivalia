import { TestBed } from '@angular/core/testing';

import { UsuarioGlobalStoreService } from './usuario-global-store-service';

describe('UsuarioGlobalStoreService', () => {
  let service: UsuarioGlobalStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsuarioGlobalStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
