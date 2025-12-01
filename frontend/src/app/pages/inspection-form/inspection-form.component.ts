import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InspectionService, InspectionData, ChecklistItem, InspectionResponse } from '../../services/inspection.service';
import {CreateInspectionRequest} from "../../models/inspection.model";
import {BuildingService}  from "../../services/building.service";
import {Building} from "../../models/building";
import {AuthService} from "../../services/auth.service";
import { BackButtonComponent } from "../back-button/back-button.component";

@Component({
  selector: 'app-inspection-form',
  standalone: true,
  imports: [CommonModule, FormsModule, BackButtonComponent],
  templateUrl: './inspection-form.component.html',
  styleUrls: ['./inspection-form.component.css']
})
export class InspectionFormComponent implements OnInit {
  // Form data
  buildingId: string = '';
  buildingName: string = '';
  inspectionDate: string = '';
  building: any = null;

  // Inspection data
  inspectionId: string | null = null;
  responses: { [questionId: string]: any } = {};
  notes: string = '';

  // UI states
  isLoading: boolean = true;
  isSaving: boolean = false;
  isSubmitting: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  // Current user
  currentUser: any = null;

  // Form tracking
  currentQuestionIndex: number = 0;
  totalQuestions: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private inspectionService: InspectionService,
    private buildingService: BuildingService,
    private authService: AuthService
  ) {
    this.loadCurrentUser();
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.buildingId = params['buildingId'];
      this.buildingName = params['buildingName'];
      this.inspectionDate = params['date'];
      this.inspectionId = params['inspectionId']; // For editing existing inspection

      if (this.buildingId) {
        this.loadBuildingData();
      } else {
        this.errorMessage = 'No building selected for inspection.';
        this.isLoading = false;
      }
    });
  }

  loadCurrentUser() {
    this.currentUser = this.authService.currentUserValue;
  }

  loadBuildingData() {
    this.isLoading = true;
    this.errorMessage = '';

    this.buildingService.getBuildingById(this.buildingId).subscribe({
      next: (building) => {
        this.building = building;
        this.totalQuestions = building?.checklistItems?.length;

        if (this.inspectionId) {
          //this.loadExistingInspection();
        } else {
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error('Error loading building:', error);
        this.errorMessage = 'Failed to load building data. Please try again.';
        this.isLoading = false;
      }
    });
  }





  isFormValid(): boolean {
    if (!this.building) return false;

    // Check if all required questions are answered
    // return this.building.checklistItems.every((item: { id: string | number; }) => {
    //   const answer = this.responses[item.id];
    //   return answer !== null && answer !== '' && answer !== undefined;
    // });

    return true;
  }

  isTextAreaQuestion(item: any): boolean {
    let arr = ['notes', 'comments', 'description', 'details'];
    let i = item?.question?.toLowerCase();
    return arr.includes(i);
  }

  saveDraft() {
    this.saveInspection('DRAFT');
  }

  submitInspection() {
    if (!this.isFormValid()) {
      this.errorMessage = 'Please answer all required questions before submitting.';
      return;
    }
    this.saveInspection('COMPLETED');
  }

  private saveInspection(status: 'DRAFT' | 'COMPLETED') {
    if (status === 'DRAFT') {
      this.isSaving = true;
    } else {
      this.isSubmitting = true;
    }

    this.errorMessage = '';

    // Prepare inspection data
    const responses: any[] = [];

    // Add checklist responses
    if (this.building) {
      this.building.checklistItems.forEach((item: { id: string; question: any; type: any; }) => {
        const id: string = item.id ? item.id : '';
        responses.push({
          questionId: item.id,
          question: item.question,
          type: item.type,
          answer: this.responses[id] ? this.responses[id] : ""
        });
      });
    }





    const inspectionData: any = {
      buildingId: this.buildingId,
      userId: this.currentUser?.userId,
      date: new Date(this.inspectionDate),
      answers: responses,
    };

    console.log(inspectionData);
    console.log(this.currentUser);

    // Update or create inspection
    const operation = this.inspectionId
      ? this.inspectionService.updateInspection(this.inspectionId, inspectionData)
      : this.inspectionService.createInspection(inspectionData);

    operation.subscribe({
      next: (result) => {
        this.isSaving = false;
        this.isSubmitting = false;

        if (status === 'COMPLETED') {
          this.successMessage = 'Inspection submitted successfully!';
          setTimeout(() => {
            this.navigateBack();
          }, 2000);
        } else {
          this.successMessage = 'Draft saved successfully!';
          this.inspectionId = result.id; // Update inspection ID for future saves
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        }
      },
      error: (error) => {
        this.isSaving = false;
        this.isSubmitting = false;
        console.error('Error saving inspection:', error);
        this.errorMessage = `Failed to ${status === 'DRAFT' ? 'save draft' : 'submit inspection'}. Please try again.`;
      }
    });
  }

  navigateBack() {
    window.history.back();
  }

  getQuestionIcon(type: string): string {
    switch (type) {
      case 'BOOLEAN':
        return 'bi-check-square';
      case 'NUMERIC':
        return 'bi-123';
      case 'TEXT':
        return 'bi-textarea-t';
      default:
        return 'bi-question-circle';
    }
  }

  getAnswerSummary(item: ChecklistItem): string {
    const answer = this.responses[item.id];

    if (answer === null || answer === undefined || answer === '') {
      return 'Not answered';
    }

    switch (item.type) {
      case 'BOOLEAN':
        return answer ? 'Yes' : answer === false ? 'No' : 'Not answered';
      case 'NUMERIC':
        return answer.toString();
      case 'TEXT':
        return answer.length > 30 ? answer.substring(0, 30) + '...' : answer;
      default:
        return 'Unknown';
    }
  }

  protected readonly String = String;
}
