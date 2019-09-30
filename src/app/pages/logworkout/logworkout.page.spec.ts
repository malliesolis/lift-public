import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogWorkoutPage } from './logworkout.page';
import { AppStorage } from 'src/app/services/app-storage.service';
import { Platform } from '@ionic/angular';

describe('LogWorkoutPage - ', () => {
    let component: LogWorkoutPage;
    let fixture: ComponentFixture<LogWorkoutPage>;
    let appStorageSpy, platformReadySpy, platformSpy;

    var timeLeft = 60;

    beforeEach(async(() => {
        appStorageSpy = jasmine.createSpyObj('AppStorage', { ready: appStorageSpy });
       
        platformReadySpy = Promise.resolve();
        platformSpy = jasmine.createSpyObj('Platform', { ready: platformReadySpy });
    
        TestBed.configureTestingModule({
          declarations: [LogWorkoutPage],
          schemas: [CUSTOM_ELEMENTS_SCHEMA],
          providers: [
            { provide: AppStorage, useValue: appStorageSpy },
            { provide: Platform, useValue: platformSpy }
          ]
        }).compileComponents();
      }));    

      beforeEach(() => {
        fixture = TestBed.createComponent(LogWorkoutPage);
        component = fixture.componentInstance;
        fixture.detectChanges();
      });
    
    xit('timerReachedZero returns true when timeLeft is 0', function() {
        expect(component.timerReachedZero()).toBeFalsy();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    
});
