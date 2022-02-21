import { TestBed } from '@angular/core/testing';

import { AsExternalServiceGuard } from './as-external-service.guard';

describe('AsExternalServiceGuard', () => {
  let guard: AsExternalServiceGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AsExternalServiceGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
