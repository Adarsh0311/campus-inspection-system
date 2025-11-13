import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BuildingService } from '../../services/building.service';
import { InspectionData, InspectionService } from '../../services/inspection.service';
import { BackButtonComponent } from "../back-button/back-button.component";
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { AuthService, UserPayload } from '../../services/auth.service';

@Component({
  selector: 'app-edit-inspection',
  standalone: true,
  imports: [DatePipe, CommonModule, FormsModule],
  templateUrl: './edit-inspection.component.html',
  styleUrl: './edit-inspection.component.css'
})
export class EditInspectionComponent {

  inspection!: InspectionData;
  buildingChecklistItems: { id: string, question: string, type: string }[] = [];
  currentUser: UserPayload | null = null;

  constructor(
    private inspectionService: InspectionService, 
    private buildingService: BuildingService, 
    private route: ActivatedRoute, 
    private router: Router,
    private authService: AuthService) { }

  ngOnInit(): void {
    const inspectionId = this.route.snapshot.paramMap.get('id');
    if (inspectionId) {
      this.inspectionService.getInspectionById(inspectionId).subscribe({
        next: (data) => {
          this.inspection = data;
          this.currentUser = this.authService.currentUserValue;

          if (this.currentUser?.role === 'TECHNICIAN' && this.currentUser?.userId !== this.inspection.userId) {
            alert('You do not have permission to edit this inspection.');
            this.goBack();
            return;
          }

        },
        error: (error) => {
          console.error('Error loading inspection:', error);
        }
      });
    }
  }

  goBack(): void {
    window.history.back();
  }

  updateInspectionAnswers(): void {
    this.inspectionService.updateInspection(this.inspection.id, this.inspection).subscribe({
      next: (data) => {
        alert('Inspection updated successfully');
        this.goBack();
      },
      error: (error) => {
        console.error('Error updating inspection:', error);
        alert('Error updating inspection');
      }
    });
  }

  getMaxDate(): string {
    return new Date().toISOString().split('T')[0];
  }



}
