import { Component, ViewChild } from '@angular/core';
import { InspectionService, InspectionData } from '../../services/inspection.service';
import { Building } from '../../models/building';
import { FormsModule } from '@angular/forms';
import { BuildingService } from '../../services/building.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { AuthService, UserPayload } from '../../services/auth.service';
import { BackButtonComponent } from "../back-button/back-button.component";
import { StartInspectionModalComponent } from '../../shared/components/inspection';
import { UserService } from '../../services/user.service';



@Component({
  selector: 'app-inspection-history',
  standalone: true,
  imports: [FormsModule, CommonModule, BackButtonComponent, StartInspectionModalComponent, FormsModule],
  templateUrl: './inspection-history.component.html',
  styleUrl: './inspection-history.component.css'
})
export class InspectionHistoryComponent {

  inspections: InspectionData[] = [];
  buildings: Building[] = [];
  selectedBuildingId: string = '';
  startDate: string = '';
  endDate: string = '';
  buildingChecklistItems: { id: string, question: string }[] = [];
  currentUser: UserPayload | null = null;
  selectedRange: string = 'this_month';

  @ViewChild('startInspectionModal') startInspectionModal!: StartInspectionModalComponent;
  users: any[] = []; // Add this line
  userId: string = 'All'; // Add this line
  errorMessage: string = '';
  //userFilter: string = 'All';

  constructor(private inspectionService: InspectionService, private buis: BuildingService, private route: ActivatedRoute, private router: Router, private authService: AuthService, private userService: UserService) { }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    this.loadBuildings();
    this.loadUsers();
    this.route.queryParams.subscribe(params => {
      this.selectedBuildingId = params['buildingId'] || '';
      this.userId = params['userId'] || 'All';
      this.startDate = params['startDate'] || '';
      this.endDate = params['endDate'] || '';
      if (this.selectedBuildingId) {
        this.loadData();
      }
    });
  }
  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (error) => {
        console.error('Error loading users:', error);
      }
    });
  }

  loadBuildingChecklistItems(buildingId: string): void {
    // Implement if needed
    this.buis.getBuildingChecklist(buildingId).subscribe({
      next: (data) => {
        console.log('Checklist items:', data);
        this.buildingChecklistItems = data;
      },
      error: (error) => {
        console.error('Error loading checklist items:', error);
      }
    });
  }

  loadBuildings(): void {
    // Replace with your actual buildings API endpoint
    this.buis.getAllBuildings().subscribe({
      next: (data) => {
        this.buildings = data;
      },
      error: (error) => {
        console.error('Error loading buildings:', error);
      }
    });
  }


  searchInspections(): void {
    if (!this.selectedBuildingId) {
      alert('Please select a building');
      return;
    }

    this.setFilterRange();
    //this.updateQueryParams();

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { buildingId: this.selectedBuildingId, userId: this.userId, startDate: this.startDate, endDate: this.endDate },
      queryParamsHandling: 'merge',
    });
  }

  loadData(): void {
    this.loadBuildingChecklistItems(this.selectedBuildingId);
    this.inspectionService.getInspectionsByBuildingWithDateRange(this.selectedBuildingId, this.userId, this.startDate, this.endDate).subscribe({
      next: (data) => {
        this.inspections = data;
      },
      error: (error) => {
        this.errorMessage = 'Error loading inspections';
        console.error('Error loading inspections:', error);
      }
    });
  }

  setFilterRange(): void {
    if (this.selectedRange === 'all') {
      this.startDate = '';
      this.endDate = '';

    } else if (this.selectedRange === 'this_week') {
      this.startDate = new Date().toISOString().split('T')[0];
      const end = new Date();
      end.setDate(end.getDate() - 7);
      this.endDate = end.toISOString().split('T')[0];

    } else if (this.selectedRange === 'this_month') {
      this.startDate = new Date().toISOString().split('T')[0];
      const end = new Date();
      end.setDate(end.getDate() - 30);
      this.endDate = end.toISOString().split('T')[0];
    }

  }


  getAnswerForQuestion(inspection: InspectionData, questionItem: { id: string, question: string }): string {
    let answer = inspection.answers.find(a => a.question === questionItem.question);
    return answer ? answer.textAnswer : '';
  }

  viewInspection(id: string): void {
    console.log('View inspection:', id);
    this.router.navigate(['/inspection/detail', id]);
  }

  editInspection(id: string): void {
    this.router.navigate(['/inspection/edit', id]);
  }

  canEditInspection(inspection: InspectionData): boolean {
    if (!inspection) {
      return false;
    }

    if (this.currentUser?.role === 'ADMIN' || inspection.userId === this.currentUser?.userId) {
      return true; // Admins can edit any inspection or users can edit their own inspections
    }

    return false;
  }

  downloadExcel(): void {
    if (!this.inspections || this.inspections.length === 0) {
      return;
    }

    // Prepare data for Excel
    const excelData: any[] = [];

    // Create header row
    const headers = ['Date', 'Submitted By'];
    this.buildingChecklistItems.forEach(q => {
      headers.push(q.question);
    });
    excelData.push(headers);

    // Create data rows
    this.inspections.forEach(inspection => {
      const row: any[] = [];

      // Add date
      const date = new Date(inspection.date).toISOString().split('T')[0];
      row.push(date);

      // Add user
      row.push(inspection.user);

      // Add answers for each question
      this.buildingChecklistItems.forEach(q => {
        row.push(this.getAnswerForQuestion(inspection, q));
      });

      excelData.push(row);
    });

    // Create workbook and worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(excelData);

    // Set column widths
    const colWidths = [
      { wch: 15 }, // Date
      { wch: 20 }  // Submitted By
    ];
    this.buildingChecklistItems.forEach(() => {
      colWidths.push({ wch: 25 }); // Question columns
    });
    ws['!cols'] = colWidths;

    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Inspections');

    // Generate filename
    const buildingName = this.buildings.find(b => b.id === this.selectedBuildingId)?.name || 'Building';
    const fileName = `${buildingName}_Inspections_${new Date().toISOString().split('T')[0]}.xlsx`;

    // Save file
    XLSX.writeFile(wb, fileName);
  }

  getMaxDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  onStartInspectionClick() {
    this.startInspectionModal.show();
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

}
