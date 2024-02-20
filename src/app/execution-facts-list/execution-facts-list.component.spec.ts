import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutionFactsListComponent } from './execution-facts-list.component';

describe('ExecutionFactsListComponent', () => {
  let component: ExecutionFactsListComponent;
  let fixture: ComponentFixture<ExecutionFactsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExecutionFactsListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExecutionFactsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
