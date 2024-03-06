import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParticipantItemComponent } from './participant-item.component';

describe('ParticipantItemComponent', () => {
  let component: ParticipantItemComponent;
  let fixture: ComponentFixture<ParticipantItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParticipantItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ParticipantItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
