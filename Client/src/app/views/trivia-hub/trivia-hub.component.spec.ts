import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TriviaHubComponent } from './trivia-hub.component';

describe('TriviaHubComponent', () => {
  let component: TriviaHubComponent;
  let fixture: ComponentFixture<TriviaHubComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TriviaHubComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TriviaHubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
