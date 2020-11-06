import { TestBed } from '@angular/core/testing';

import { KmTrackerService } from './km-tracker.service';

describe('KmTrackerService', () => {
  let service: KmTrackerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KmTrackerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
