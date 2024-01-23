import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCreationFormComponent } from './user-creation-form.component';

describe('UserCreationFormComponent', () => {
  let component: UserCreationFormComponent;
  let fixture: ComponentFixture<UserCreationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserCreationFormComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserCreationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
