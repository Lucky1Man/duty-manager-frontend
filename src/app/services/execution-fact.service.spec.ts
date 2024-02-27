import { TestBed } from '@angular/core/testing';

import { ExecutionFactService } from './execution-fact.service';

describe('ExecutionFactService', () => {
  let service: ExecutionFactService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExecutionFactService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
