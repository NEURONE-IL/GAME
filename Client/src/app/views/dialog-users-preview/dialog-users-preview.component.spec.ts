import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogUsersPreviewComponent } from './dialog-users-preview.component';

describe('DialogUsersPreviewComponent', () => {
  let component: DialogUsersPreviewComponent;
  let fixture: ComponentFixture<DialogUsersPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DialogUsersPreviewComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogUsersPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
