import { TestBed } from '@angular/core/testing';

import { ExecutionFactActionsShareService } from './execution-fact-actions-share.service';

describe('ExecutionFactActionsShareService', () => {
  let service: ExecutionFactActionsShareService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExecutionFactActionsShareService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
