import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TriviaHubOpenComponent } from './trivia-hub-open.component';

describe('TriviaHubOpenComponent', () => {
  let component: TriviaHubOpenComponent;
  let fixture: ComponentFixture<TriviaHubOpenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TriviaHubOpenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TriviaHubOpenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
