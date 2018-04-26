import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleshowComponent } from './scheduleshow.component';

describe('ScheduleshowComponent', () => {
  let component: ScheduleshowComponent;
  let fixture: ComponentFixture<ScheduleshowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleshowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleshowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
