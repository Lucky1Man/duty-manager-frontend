import { TestBed } from '@angular/core/testing';

import { TemplateActionsShareService } from './template-actions-share.service';

describe('TemplateActionsShareService', () => {
  let service: TemplateActionsShareService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TemplateActionsShareService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
