import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyUpdateComponent } from './study-update.component';

describe('StudyUpdateComponent', () => {
  let component: StudyUpdateComponent;
  let fixture: ComponentFixture<StudyUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudyUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudyUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
