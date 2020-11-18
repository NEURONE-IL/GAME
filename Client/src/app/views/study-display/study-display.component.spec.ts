import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyDisplayComponent } from './study-display.component';

describe('StudyDisplayComponent', () => {
  let component: StudyDisplayComponent;
  let fixture: ComponentFixture<StudyDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudyDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudyDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
