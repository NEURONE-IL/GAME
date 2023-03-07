import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudiesSearchResultsComponent } from './studies-search-results.component';

describe('StudiesSearchResultsComponent', () => {
  let component: StudiesSearchResultsComponent;
  let fixture: ComponentFixture<StudiesSearchResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudiesSearchResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudiesSearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
