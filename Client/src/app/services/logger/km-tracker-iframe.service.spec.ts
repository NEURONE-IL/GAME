import { TestBed } from '@angular/core/testing';

import { KmTrackerIframeService } from './km-tracker-iframe.service';

describe('KmTrackerIframeService', () => {
  let service: KmTrackerIframeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KmTrackerIframeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
