import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreTestQuestionnaireComponent } from './pre-test-questionnaire.component';

describe('PreTestQuestionnaireComponent', () => {
  let component: PreTestQuestionnaireComponent;
  let fixture: ComponentFixture<PreTestQuestionnaireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreTestQuestionnaireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreTestQuestionnaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
