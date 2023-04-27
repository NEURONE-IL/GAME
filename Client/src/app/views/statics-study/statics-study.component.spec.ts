import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StaticsStudyComponent } from './statics-study.component';

describe('StaticsStudyComponent', () => {
  let component: StaticsStudyComponent;
  let fixture: ComponentFixture<StaticsStudyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StaticsStudyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaticsStudyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
