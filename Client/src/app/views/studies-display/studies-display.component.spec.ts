import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudiesDisplayComponent } from './studies-display.component';

describe('StudiesDisplayComponent', () => {
  let component: StudiesDisplayComponent;
  let fixture: ComponentFixture<StudiesDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudiesDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudiesDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
