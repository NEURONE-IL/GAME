import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallengeDisplayComponent } from './challenge-display.component';

describe('ChallengeDisplayComponent', () => {
  let component: ChallengeDisplayComponent;
  let fixture: ComponentFixture<ChallengeDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChallengeDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChallengeDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
