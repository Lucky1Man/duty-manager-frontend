import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutionFactItemComponent } from './execution-fact-item.component';

describe('ExecutionFactItemComponent', () => {
  let component: ExecutionFactItemComponent;
  let fixture: ComponentFixture<ExecutionFactItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExecutionFactItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExecutionFactItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
