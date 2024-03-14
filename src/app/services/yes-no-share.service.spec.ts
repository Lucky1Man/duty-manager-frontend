import { TestBed } from '@angular/core/testing';

import { YesNoShareService } from './yes-no-share.service';

describe('YesNoShareService', () => {
  let service: YesNoShareService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YesNoShareService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
