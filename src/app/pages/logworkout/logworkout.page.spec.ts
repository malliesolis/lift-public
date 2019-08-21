import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogWorkoutPage } from './logworkout.page';

describe('LogWorkoutPage', () => {
  let component: LogWorkoutPage;
  let fixture: ComponentFixture<LogWorkoutPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LogWorkoutPage],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogWorkoutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
