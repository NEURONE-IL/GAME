import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialQuestionaryComponent } from './initial-questionary.component';

describe('InitialQuestionaryComponent', () => {
  let component: InitialQuestionaryComponent;
  let fixture: ComponentFixture<InitialQuestionaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitialQuestionaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitialQuestionaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
