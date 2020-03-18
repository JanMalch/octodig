import { TestBed } from '@angular/core/testing';
import { InitialFileRedirectGuard } from './initial-file.redirect.guard';

describe('InitialFileRedirectGuard', () => {
  let guard: InitialFileRedirectGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(InitialFileRedirectGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
