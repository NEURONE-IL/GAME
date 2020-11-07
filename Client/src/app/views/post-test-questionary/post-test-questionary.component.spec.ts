import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostTestQuestionaryComponent } from './post-test-questionary.component';

describe('PostTestQuestionaryComponent', () => {
  let component: PostTestQuestionaryComponent;
  let fixture: ComponentFixture<PostTestQuestionaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostTestQuestionaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostTestQuestionaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
