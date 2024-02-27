import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutionFactsComponent } from './execution-facts.component';

describe('ExecutionFactsComponent', () => {
  let component: ExecutionFactsComponent;
  let fixture: ComponentFixture<ExecutionFactsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExecutionFactsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExecutionFactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
