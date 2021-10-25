import { TestBed } from '@angular/core/testing';

import { ActionsTrackerService } from './actions-tracker.service';

describe('ActionsTrackerService', () => {
  let service: ActionsTrackerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActionsTrackerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
