import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionBarComponent } from './question-bar.component';

describe('QuestionBarComponent', () => {
  let component: QuestionBarComponent;
  let fixture: ComponentFixture<QuestionBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
