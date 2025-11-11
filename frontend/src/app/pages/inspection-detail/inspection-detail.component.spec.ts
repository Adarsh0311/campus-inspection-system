import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionDetailComponent } from './inspection-detail.component';

describe('InspectionDetailComponent', () => {
  let component: InspectionDetailComponent;
  let fixture: ComponentFixture<InspectionDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InspectionDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InspectionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
