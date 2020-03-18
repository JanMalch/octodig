import { TestBed } from '@angular/core/testing';

import { NotFoundInterceptor } from './not-found-interceptor.service';

describe('NotFoundInterceptorService', () => {
  let service: NotFoundInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotFoundInterceptor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
