import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditExercisePage } from './editexercise.page';

describe('EditexercisePage', () => {
  let component: EditExercisePage;
  let fixture: ComponentFixture<EditExercisePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditExercisePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditExercisePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
