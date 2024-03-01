import { TestBed } from '@angular/core/testing';

import { ExecutionFactsLoadSettingsShareService } from './execution-facts-load-settings-share.service';

describe('ExecutionFactsLoadSettingsShareService', () => {
  let service: ExecutionFactsLoadSettingsShareService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExecutionFactsLoadSettingsShareService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
