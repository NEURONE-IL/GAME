import { TestBed } from '@angular/core/testing';

import { StoreLinkService } from './store-link.service';

describe('StoreLinkService', () => {
  let service: StoreLinkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StoreLinkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
