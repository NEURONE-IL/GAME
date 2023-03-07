import { TestBed } from '@angular/core/testing';

import { StudySearchService } from './study-search.service';

describe('SearchStudyService', () => {
  let service: StudySearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudySearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
