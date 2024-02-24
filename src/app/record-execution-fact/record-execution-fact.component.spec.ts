import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordExecutionFactComponent } from './record-execution-fact.component';

describe('RecordExecutionFactComponent', () => {
  let component: RecordExecutionFactComponent;
  let fixture: ComponentFixture<RecordExecutionFactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecordExecutionFactComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecordExecutionFactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
