import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InspectionService } from '../../../services/inspection.service';
import { Building } from '../../../models/building';
import {BuildingService} from '../../../services/building.service';

declare var bootstrap: any;

@Component({
  selector: 'app-view-history-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- View History Modal -->
    <div class="modal fade" id="viewHistoryModal" tabindex="-1" aria-labelledby="viewHistoryModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="viewHistoryModalLabel">
              <i class="bi bi-clock-history me-2"></i>
              View Inspection History
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>

          <div class="modal-body">
            <!-- Error Message -->
            <div *ngIf="errorMessage" class="alert alert-danger" role="alert">
              <i class="bi bi-exclamation-triangle me-2"></i>
              {{ errorMessage }}
            </div>

            <!-- Building Selection -->
            <div class="mb-4">
              <label for="historyBuildingSelect" class="form-label">
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
                id="historyBuildingSelect"
                [(ngModel)]="selectedBuildingId"
                name="historyBuildingSelect"
                required>
                <option value="">Choose a building...</option>
                <!-- <option value="all" *ngIf="userRole === 'ADMIN'">All Buildings</option> -->
                <option *ngFor="let building of buildings" [value]="building.id">
                  {{ building.name }}
                  <span *ngIf="building.location"> - {{ building.location }}</span>
                </option>
              </select>
            </div>

            <!-- Date Range Selection -->
            <!-- <div class="mb-4">
              <label class="form-label">
                <i class="bi bi-calendar-range me-2"></i>
                Date Range (Optional)
              </label>
              <select
                class="form-select"
                [(ngModel)]="selectedDateRange"
                name="dateRange">
                <option value="all">All Time</option>
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="custom">Custom Range</option>
              </select>
            </div> -->

            <!-- Custom Date Range -->
            <!-- <div *ngIf="selectedDateRange === 'custom'" class="mb-4">
              <div class="row g-3">
                <div class="col-6">
                  <label for="fromDate" class="form-label">From Date</label>
                  <input
                    type="date"
                    class="form-control"
                    id="fromDate"
                    [(ngModel)]="customFromDate"
                    name="fromDate">
                </div>
                <div class="col-6">
                  <label for="toDate" class="form-label">To Date</label>
                  <input
                    type="date"
                    class="form-control"
                    id="toDate"
                    [(ngModel)]="customToDate"
                    name="toDate"
                    [max]="maxDate">
                </div>
              </div>
            </div> -->


            <!-- All Buildings Info -->
            <!-- <div *ngIf="selectedBuildingId === 'all'" class="card bg-light">
              <div class="card-body py-3">
                <h6 class="card-title mb-2">
                  <i class="bi bi-buildings me-2"></i>
                  All Buildings
                </h6>
                <small class="text-muted">
                  <i class="bi bi-info-circle me-1"></i>
                  View inspection history across all campus buildings
                </small>
              </div>
            </div> -->
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Cancel
            </button>
            <button
              type="button"
              class="btn" style="background-color: green; color:white;"
              (click)="viewHistory()"
              [disabled]="!selectedBuildingId || isLoading">
              <span *ngIf="!isLoading">
                View History
              </span>
              <span *ngIf="isLoading">
                <div class="spinner-border spinner-border-sm me-2" role="status"></div>
                Loading...
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
export class ViewHistoryModalComponent implements OnInit {
  @Input() userRole: string = 'TECHNICIAN'; // Can be 'INSPECTOR' or 'ADMIN'
  @Output() historyRequested = new EventEmitter<{
    buildingId: string;
    buildingName?: string;
    dateRange: string;
    customFromDate?: string;
    customToDate?: string;
  }>();

  buildings: Building[] = [];
  selectedBuildingId: string = '';
  selectedDateRange: string = '30'; // Default to last 30 days
  customFromDate: string = '';
  customToDate: string = '';

  isLoadingBuildings: boolean = false;
  isLoading: boolean = false;
  errorMessage: string = '';
  maxDate: string = '';

  private modal: any;

  constructor(private buildingService: BuildingService) {
    // Set max date to today
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
      const modalElement = document.getElementById('viewHistoryModal');
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

  viewHistory() {
    if (!this.selectedBuildingId) {
      this.errorMessage = 'Please select a building.';
      return;
    }

    // Validate custom date range
    if (this.selectedDateRange === 'custom') {
      if (!this.customFromDate || !this.customToDate) {
        this.errorMessage = 'Please select both from and to dates.';
        return;
      }
      if (new Date(this.customFromDate) > new Date(this.customToDate)) {
        this.errorMessage = 'From date cannot be later than to date.';
        return;
      }
    }

    this.isLoading = true;
    this.errorMessage = '';

    const historyRequest: any = {
      buildingId: this.selectedBuildingId,
      //dateRange: this.selectedDateRange
    };

    // Emit the history request to parent component
    this.historyRequested.emit(historyRequest);

    // Reset and close
    this.resetForm();
    this.hide();
    this.isLoading = false;
  }

  resetForm() {
    this.selectedBuildingId = '';
    this.selectedDateRange = '30';
    this.customFromDate = '';
    this.customToDate = '';
    this.errorMessage = '';
    this.isLoading = false;
  }
}
