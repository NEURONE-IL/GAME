import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostStudyQuestionnaireComponent } from './post-study-questionnaire.component';

describe('PostStudyQuestionnaireComponent', () => {
  let component: PostStudyQuestionnaireComponent;
  let fixture: ComponentFixture<PostStudyQuestionnaireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostStudyQuestionnaireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostStudyQuestionnaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
