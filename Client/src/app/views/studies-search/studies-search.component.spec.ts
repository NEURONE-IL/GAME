import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudiesSearchComponent } from './studies-search.component';

describe('StudiesSearchComponent', () => {
  let component: StudiesSearchComponent;
  let fixture: ComponentFixture<StudiesSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudiesSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudiesSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
