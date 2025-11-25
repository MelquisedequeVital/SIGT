import { TestBed } from '@angular/core/testing';

import { TccStore } from './tcc-store';

describe('TccStore', () => {
  let service: TccStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TccStore);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
