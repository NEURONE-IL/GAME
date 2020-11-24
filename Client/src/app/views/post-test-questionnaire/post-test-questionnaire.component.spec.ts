import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostTestQuestionnaireComponent } from./post-test-questionnaire.componentnent';

describe('PostTestQuestionnaireComponent', () => {
  let component: PostTestQuestionnaireComponent;
  let fixture: ComponentFixture<PostTestQuestionnaireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostTestQuestionnaireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostTestQuestionnaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
