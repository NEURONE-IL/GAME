import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialQuestionnaireComponent } from './initial-questionnaire.component';

describe('InitialQuestionnaireComponent', () => {
  let component: InitialQuestionnaireComponent;
  let fixture: ComponentFixture<InitialQuestionnaireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitialQuestionnaireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitialQuestionnaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
