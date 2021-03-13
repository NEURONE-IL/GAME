import { TestBed } from '@angular/core/testing';

import { StoreQueryService } from './store-query.service';

describe('StoreQueryService', () => {
  let service: StoreQueryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StoreQueryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
