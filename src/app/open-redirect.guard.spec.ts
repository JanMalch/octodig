import { TestBed } from '@angular/core/testing';

import { OpenRedirectGuard } from './open-redirect.guard';

describe('OpenRedirectGuard', () => {
  let guard: OpenRedirectGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(OpenRedirectGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
