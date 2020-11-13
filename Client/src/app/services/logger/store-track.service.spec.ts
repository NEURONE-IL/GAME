import { TestBed } from '@angular/core/testing';

import { StoreTrackService } from './store-track.service';

describe('StoreTrackService', () => {
  let service: StoreTrackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StoreTrackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
