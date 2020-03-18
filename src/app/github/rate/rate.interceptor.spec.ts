import { TestBed } from '@angular/core/testing';

import { RateInterceptorService } from './rate.interceptor';

describe('RateInterceptorService', () => {
  let service: RateInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RateInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
