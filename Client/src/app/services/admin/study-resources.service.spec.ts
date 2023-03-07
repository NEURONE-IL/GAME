import { TestBed } from '@angular/core/testing';

import { StudyResourcesService } from './study-resources.service';

describe('StudyResourcesService', () => {
  let service: StudyResourcesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudyResourcesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
