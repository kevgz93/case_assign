import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekendRotationComponent } from './weekendRotation.component';

describe('RotationComponent', () => {
  let component: WeekendRotationComponent;
  let fixture: ComponentFixture<WeekendRotationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeekendRotationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeekendRotationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
