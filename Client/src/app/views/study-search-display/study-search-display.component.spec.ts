import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudySearchDisplayComponent } from './study-search-display.component';

describe('StudySearchDisplayComponent', () => {
  let component: StudySearchDisplayComponent;
  let fixture: ComponentFixture<StudySearchDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudySearchDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudySearchDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
