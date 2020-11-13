import { TestBed } from '@angular/core/testing';

import { StoreSessionService } from './store-session.service';

describe('StoreSessionService', () => {
  let service: StoreSessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StoreSessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
