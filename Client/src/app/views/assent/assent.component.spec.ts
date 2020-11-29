import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssentComponent } from './assent.component';

describe('AssentComponent', () => {
  let component: AssentComponent;
  let fixture: ComponentFixture<AssentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
