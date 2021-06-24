import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayAgainComponent } from './play-again.component';

describe('PlayAgainComponent', () => {
  let component: PlayAgainComponent;
  let fixture: ComponentFixture<PlayAgainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayAgainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayAgainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
