import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSearchResultComponent } from './admin-search-result.component';

describe('AdminSearchResultComponent', () => {
  let component: AdminSearchResultComponent;
  let fixture: ComponentFixture<AdminSearchResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminSearchResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSearchResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });




});
