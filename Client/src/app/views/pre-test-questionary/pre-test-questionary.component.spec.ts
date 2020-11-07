import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreTestQuestionaryComponent } from './pre-test-questionary.component';

describe('PreTestQuestionaryComponent', () => {
  let component: PreTestQuestionaryComponent;
  let fixture: ComponentFixture<PreTestQuestionaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreTestQuestionaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreTestQuestionaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
