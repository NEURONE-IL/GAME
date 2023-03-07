import { TestBed } from '@angular/core/testing';

import { ProtectStudyEditionGuard } from './protect-study-edition.guard';

describe('ProtectStudyEditionGuard', () => {
  let guard: ProtectStudyEditionGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ProtectStudyEditionGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
