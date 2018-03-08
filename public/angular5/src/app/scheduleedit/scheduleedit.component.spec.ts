import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleeditComponent } from './scheduleedit.component';

describe('ScheduleeditComponent', () => {
  let component: ScheduleeditComponent;
  let fixture: ComponentFixture<ScheduleeditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleeditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
