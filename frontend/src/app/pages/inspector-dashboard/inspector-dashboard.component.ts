import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { InspectionService, InspectionData } from '../../services/inspection.service';
import { StartInspectionModalComponent } from '../../shared/components/inspection/start-inspection-modal.component';
import { ViewHistoryModalComponent } from '../../shared/components/inspection/view-history-modal.component';
import { AllBuildingsModalComponent } from '../../shared/components/inspection/all-buildings-modal.component';

@Component({
  selector: 'app-inspector-dashboard',
  standalone: true,
  imports: [
    CommonModule,
     StartInspectionModalComponent,
     ViewHistoryModalComponent,
     AllBuildingsModalComponent
  ],
  templateUrl: './inspector-dashboard.component.html',
  styleUrls: ['./inspector-dashboard.component.css']
})
export class InspectorDashboardComponent implements OnInit {
   @ViewChild('startInspectionModal') startInspectionModal!: StartInspectionModalComponent;
   @ViewChild('viewHistoryModal') viewHistoryModal!: ViewHistoryModalComponent;
   @ViewChild('allBuildingsModal') allBuildingsModal!: AllBuildingsModalComponent;


  currentUser: any = null;
  recentInspections: InspectionData[] = [];
  isLoadingRecent: boolean = false;

  constructor(
    private authService: AuthService,
    private inspectionService: InspectionService,
    private router: Router
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.currentUserValue;
    
  }


  // Card Click Handlers
  // Handler for the "Start Inspection" card click; shows the start inspection modal.
  onStartInspectionClick() {
    if (this.startInspectionModal) {
      this.startInspectionModal.show();
    }
  }

  //
  onViewHistoryClick() {
    this.viewHistoryModal.show();
  }

  onAllBuildingsClick() {
    this.allBuildingsModal.show();
  }

  // Modal Event Handlers
  onInspectionStarted(data: { buildingId: string; buildingName: string; date: string }) {
    // Navigate to inspection form with the selected data
    this.router.navigate(['/inspection/form'], {
      queryParams: {
        buildingId: data.buildingId,
        buildingName: data.buildingName,
        date: data.date
      }
    });
  }

  onHistoryRequested(data: any) {
    // Navigate to history page with filters
    this.router.navigate(['/inspection/history'], {
      queryParams: data
    });
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  }

  getInspectionStatusIcon(status: string): string {
    switch (status) {
      case 'COMPLETED':
        return 'bi-check-circle-fill text-success';
      case 'DRAFT':
        return 'bi-clock-fill text-warning';
      default:
        return 'bi-circle text-secondary';
    }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  doNothing() {}

  protected readonly Date = Date;
}
