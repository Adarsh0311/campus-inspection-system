import { Component } from '@angular/core';
import { InspectionData, InspectionService } from '../../services/inspection.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BuildingService } from '../../services/building.service';
import { CommonModule } from '@angular/common';
import { BackButtonComponent } from "../back-button/back-button.component";


@Component({
  selector: 'app-inspection-detail',
  standalone: true,
  imports: [CommonModule, BackButtonComponent],
  templateUrl: './inspection-detail.component.html',
  styleUrls: ['./inspection-detail.component.css']
})
export class InspectionDetailComponent {

    inspection!: InspectionData;
    buildingChecklistItems: {id: string, question: string}[] = [];

    goBack(): void {
      window.history.back();
    }
  
    constructor(private inspectionService: InspectionService, private buildingService: BuildingService, private route: ActivatedRoute, private router: Router) {}
  
    ngOnInit(): void {
      const inspectionId = this.route.snapshot.paramMap.get('id');
      if (inspectionId) {
        this.inspectionService.getInspectionById(inspectionId).subscribe({
          next: (data) => {
            this.inspection = data;
            if (this.inspection.buildingId) {
              this.loadBuildingChecklistItems(this.inspection.buildingId);
            }
          },
          error: (error) => {
            console.error('Error loading inspection:', error);
          }
        });
      }
    }
  
    loadBuildingChecklistItems(buildingId: string): void {
      // Implement if needed
      this.buildingService.getBuildingChecklist(buildingId).subscribe({
        next: (data) => {
          console.log('Checklist items:', data);
          this.buildingChecklistItems = data;
        },
        error: (error) => {
          console.error('Error loading checklist items:', error);
        }
      });
    }

     // Helper method to get answer for a specific question in an inspection
    getAnswerForQuestion(inspection: InspectionData, questionItem: {id: string, question: string}): string {
      // First try to match by questionId if available
      let answer = inspection.answers.find(a => a.question === questionItem.question);
      
      // If not found, try to match by question text (fallback)
      if (!answer) {
        answer = inspection.answers.find(a => a.question === questionItem.question);
      }
  
      return answer ? answer.textAnswer : '';
    }
  
    getMaxDate(): string {
      return new Date().toISOString().split('T')[0];
    }
  
}
