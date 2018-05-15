import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RotationeditComponent } from './rotationedit.component';

describe('RotationeditComponent', () => {
  let component: RotationeditComponent;
  let fixture: ComponentFixture<RotationeditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RotationeditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RotationeditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
