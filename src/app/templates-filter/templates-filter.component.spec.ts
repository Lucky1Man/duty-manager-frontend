import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatesFilterComponent } from './templates-filter.component';

describe('TemplatesFilterComponent', () => {
  let component: TemplatesFilterComponent;
  let fixture: ComponentFixture<TemplatesFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplatesFilterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TemplatesFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
