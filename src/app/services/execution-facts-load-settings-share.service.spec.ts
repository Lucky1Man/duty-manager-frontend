import { TestBed } from '@angular/core/testing';

import { ExecutionFactsLoadParametersShareService } from './execution-facts-load-settings-share.service';

describe('ExecutionFactsLoadSettingsShareService', () => {
  let service: ExecutionFactsLoadParametersShareService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExecutionFactsLoadParametersShareService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
