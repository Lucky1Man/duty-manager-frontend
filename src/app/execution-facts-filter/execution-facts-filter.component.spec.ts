import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutionFactsFilterComponent } from './execution-facts-filter.component';

describe('ExecutionFactsFilterComponent', () => {
  let component: ExecutionFactsFilterComponent;
  let fixture: ComponentFixture<ExecutionFactsFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExecutionFactsFilterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExecutionFactsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
