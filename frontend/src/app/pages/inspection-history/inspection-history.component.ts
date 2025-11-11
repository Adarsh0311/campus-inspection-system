import { Component } from '@angular/core';
import { InspectionService, InspectionData } from '../../services/inspection.service';
import { Building } from '../../models/building';
import { FormsModule } from '@angular/forms';
import { BuildingService } from '../../services/building.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import * as XLSX from 'xlsx';
import { AuthService, UserPayload } from '../../services/auth.service';

@Component({
  selector: 'app-inspection-history',
  standalone: true,
  imports: [FormsModule, CommonModule],
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

  constructor(private inspectionService: InspectionService, private buis: BuildingService, private route: ActivatedRoute, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;
    this.loadBuildings();
    this.route.queryParams.subscribe(params => {
      this.selectedBuildingId = params['buildingId'] || '';
      if (this.selectedBuildingId) {
        this.searchInspections();
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
    this.buis.getBuildings().subscribe({
      next: (data) => {
        this.buildings = data;
      },
      error: (error) => {
        console.error('Error loading buildings:', error);
      }
    });
  }

  updateQueryParams(): void {
    const queryParams: any = {};
    if (this.selectedBuildingId) {
      queryParams['buildingId'] = this.selectedBuildingId;
    }
    if (this.startDate) {
      queryParams['startDate'] = this.startDate;
    }
    if (this.endDate) {
      queryParams['endDate'] = this.endDate;
    }
    // Implement logic to update the URL with queryParams if needed

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams,
      queryParamsHandling: 'merge', // Merge with existing params if needed, or use '' to replace all
      replaceUrl: true // Don't add to browser history
    });
  }

  searchInspections(): void {
    if (!this.selectedBuildingId) {
      alert('Please select a building');
      return;
    }

    this.updateQueryParams();
    this.loadBuildingChecklistItems(this.selectedBuildingId);
    this.inspectionService.getInspectionsByBuildingWithDateRange(this.selectedBuildingId, this.startDate, this.endDate).subscribe({
      next: (data) => {
        this.inspections = data;
      },
      error: (error) => {
        alert('Error loading inspections');
        console.error('Error loading inspections:', error);
      }
    });
  }

  // Helper method to get answer for a specific question in an inspection
  getAnswerForQuestion(inspection: InspectionData, questionItem: { id: string, question: string }): string {
    // First try to match by questionId if available
    let answer = inspection.answers.find(a => a.question === questionItem.question);

    // If not found, try to match by question text (fallback)
    if (!answer) {
      answer = inspection.answers.find(a => a.question === questionItem.question);
    }

    return answer ? answer.textAnswer : '';
  }

  viewInspection(id: string): void {
    console.log('View inspection:', id);
    this.router.navigate(['/inspection/detail', id]);
  }

  editInspection(id: string): void {
    console.log('Edit inspection:', id);
    // Implement edit logic
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
      const date = new Date(inspection.date);
      row.push(date.toLocaleDateString('en-US'));

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


}
