import { TestBed } from '@angular/core/testing';

import { AppStorage } from './app-storage.service';

describe('AppStorage', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AppStorage = TestBed.get(AppStorage);
    expect(service).toBeTruthy();
  });
});
