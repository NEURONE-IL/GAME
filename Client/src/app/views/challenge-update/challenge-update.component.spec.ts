import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallengeUpdateComponent } from './challenge-update.component';

describe('ChallengeUpdateComponent', () => {
  let component: ChallengeUpdateComponent;
  let fixture: ComponentFixture<ChallengeUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChallengeUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChallengeUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
