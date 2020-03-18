import { TestBed } from '@angular/core/testing';

import { DataLookupService } from './data-lookup.service';

describe('ContentService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service = TestBed.inject(DataLookupService);
    expect(service).toBeTruthy();
  });
});
