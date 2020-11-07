import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyCreationComponent } from './study-creation.component';

describe('StudyCreationComponent', () => {
  let component: StudyCreationComponent;
  let fixture: ComponentFixture<StudyCreationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudyCreationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudyCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
