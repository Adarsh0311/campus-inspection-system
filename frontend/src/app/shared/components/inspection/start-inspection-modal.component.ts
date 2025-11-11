import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Building } from '../../../models/building';
import { InspectionService } from '../../../services/inspection.service';
import { BuildingService } from '../../../services/building.service';

declare var bootstrap: any;

@Component({
  selector: 'app-start-inspection-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Start Inspection Modal -->
    <div class="modal fade" id="startInspectionModal" tabindex="-1" aria-labelledby="startInspectionModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="startInspectionModalLabel">
              <i class="bi bi-clipboard-plus me-2"></i>
              Start New Inspection
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>

          <div class="modal-body">
            <!-- Error Message -->
            <div *ngIf="errorMessage" class="alert alert-danger" role="alert">
              <i class="bi bi-exclamation-triangle me-2"></i>
              {{ errorMessage }}
            </div>

            <!-- Date Selection -->
            <div class="mb-4">
              <label for="inspectionDate" class="form-label">
                <i class="bi bi-calendar me-2"></i>
                Inspection Date <span class="text-danger">*</span>
              </label>
              <input
                type="date"
                class="form-control"
                id="inspectionDate"
                [(ngModel)]="selectedDate"
                name="inspectionDate"
                [max]="maxDate"
                [min]="maxDate"
                required>
              <div class="form-text">Select the date when the inspection will be performed</div>
            </div>

            <!-- Building Selection -->
            <div class="mb-4">
              <label for="buildingSelect" class="form-label">
                <i class="bi bi-building me-2"></i>
                Select Building <span class="text-danger">*</span>
              </label>

              <!-- Loading State -->
              <div *ngIf="isLoadingBuildings" class="d-flex align-items-center">
                <div class="spinner-border spinner-border-sm me-2" role="status"></div>
                <span>Loading buildings...</span>
              </div>

              <!-- Building Dropdown -->
              <select
                *ngIf="!isLoadingBuildings"
                class="form-select"
                id="buildingSelect"
                [(ngModel)]="selectedBuildingId"
                name="buildingSelect"
                required>
                <option value="">Choose a building...</option>
                <option *ngFor="let building of buildings" [value]="building.id">
                  {{ building.name }}
                  <span *ngIf="building.location"> - {{ building.location }}</span>
                </option>
              </select>

<!--              <div class="form-text" *ngIf="selectedBuilding">-->
<!--                <i class="bi bi-info-circle me-1"></i>-->
<!--                {{ selectedBuilding.checklistItems.length || 0 }} checklist items to complete-->
<!--              </div>-->
            </div>

            <!-- Building Info Preview -->
<!--            <div *ngIf="selectedBuilding" class="card bg-light">-->
<!--              <div class="card-body py-3">-->
<!--                <h6 class="card-title mb-2">-->
<!--                  <i class="bi bi-building me-2"></i>-->
<!--                  {{ selectedBuilding.name }}-->
<!--                </h6>-->
<!--                <p class="card-text mb-2" *ngIf="selectedBuilding.location">-->
<!--                  <i class="bi bi-geo-alt me-2 text-muted"></i>-->
<!--                  {{ selectedBuilding.location }}-->
<!--                </p>-->
<!--                <small class="text-muted">-->
<!--                  <i class="bi bi-list-check me-1"></i>-->
<!--                  {{ selectedBuilding.checklistItems.length || 0 }} inspection items-->
<!--                </small>-->
<!--              </div>-->
<!--            </div>-->
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Cancel
            </button>
            <button
              type="button"
              class="btn btn-success"
              (click)="startInspection()"
              [disabled]="!selectedDate || !selectedBuildingId || isStarting">
              <span *ngIf="!isStarting">
                Begin Inspection
              </span>
              <span *ngIf="isStarting">
                <div class="spinner-border spinner-border-sm me-2" role="status"></div>
                Starting...
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-header {
      background-color: var(--gray-50);
      border-bottom: 1px solid var(--gray-200);
    }

    .modal-footer {
      background-color: var(--gray-50);
      border-top: 1px solid var(--gray-200);
    }

    .form-control, .form-select {
      border-radius: var(--border-radius);
      border: 1px solid var(--gray-300);
    }

    .form-control:focus, .form-select:focus {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 0.2rem rgba(0, 77, 64, 0.25);
    }

    .card {
      border: 1px solid var(--gray-200);
      border-radius: var(--border-radius);
    }
  `]
})
export class StartInspectionModalComponent implements OnInit {
  @Input() userRole: string = 'TECHNICIAN'; // Can be 'INSPECTOR' or 'ADMIN'
  @Output() inspectionStarted = new EventEmitter<{
    buildingId: string;
    buildingName: string;
    date: string;
  }>();

  buildings: Building[] = [];
  selectedDate: string = '';
  selectedBuildingId: string = '';
  isLoadingBuildings: boolean = false;
  isStarting: boolean = false;
  errorMessage: string = '';
  maxDate: string = '';

  private modal: any;

  constructor(private inspectionService: InspectionService, private buildingService: BuildingService) {
    // Set default date to today
    this.selectedDate = new Date().toISOString().split('T')[0];
    // Set max date to today (prevent future dates)
    this.maxDate = new Date().toISOString().split('T')[0];
  }

  ngOnInit() {
    this.loadBuildings();
    this.initializeModal();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initializeModal();
    }, 100);
  }

  initializeModal() {
    if (typeof bootstrap !== 'undefined') {
      const modalElement = document.getElementById('startInspectionModal');
      if (modalElement) {
        this.modal = new bootstrap.Modal(modalElement);
      }
    }
  }

  loadBuildings() {
    this.isLoadingBuildings = true;
    this.errorMessage = '';

    this.buildingService.getBuildings().subscribe({
      next: (buildings) => {
        this.buildings = buildings;
        this.isLoadingBuildings = false;
      },
      error: (error) => {
        console.error('Error loading buildings:', error);
        this.errorMessage = 'Failed to load buildings. Please try again.';
        this.isLoadingBuildings = false;
      }
    });
  }

  get selectedBuilding(): Building | undefined {
    return this.buildings.find(b => b.id === this.selectedBuildingId);
  }

  show() {
    if (this.modal) {
      this.modal.show();
    }
  }

  hide() {
    if (this.modal) {
      this.modal.hide();
    }
  }

  startInspection() {
    if (!this.selectedDate || !this.selectedBuildingId) {
      this.errorMessage = 'Please select both date and building.';
      return;
    }

    this.isStarting = true;
    this.errorMessage = '';

    const selectedBuilding = this.selectedBuilding;
    if (selectedBuilding) {
      // Emit the inspection data to parent component
      this.inspectionStarted.emit({
        buildingId: this.selectedBuildingId,
        buildingName: selectedBuilding.name,
        date: this.selectedDate
      });

      // Reset form
      this.resetForm();
      this.hide();
    }

    this.isStarting = false;
  }

  resetForm() {
    this.selectedDate = new Date().toISOString().split('T')[0];
    this.selectedBuildingId = '';
    this.errorMessage = '';
    this.isStarting = false;
  }
}
