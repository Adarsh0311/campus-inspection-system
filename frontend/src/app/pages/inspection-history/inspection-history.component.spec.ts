import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionHistoryComponent } from './inspection-history.component';

describe('InspectionHistoryComponent', () => {
  let component: InspectionHistoryComponent;
  let fixture: ComponentFixture<InspectionHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InspectionHistoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InspectionHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
