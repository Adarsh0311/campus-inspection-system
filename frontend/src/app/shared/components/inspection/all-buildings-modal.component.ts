import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuildingService } from '../../../services/building.service';
import { Building } from '../../../models/building';

declare var bootstrap: any;

@Component({
  selector: 'app-all-buildings-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- All Buildings Modal -->
    <div class="modal fade" id="allBuildingsModal" tabindex="-1" aria-labelledby="allBuildingsModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="allBuildingsModalLabel">
              <i class="bi bi-buildings me-2"></i>
              All Campus Buildings
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>

          <div class="modal-body">
            <!-- Error Message -->
            <div *ngIf="errorMessage" class="alert alert-danger" role="alert">
              <i class="bi bi-exclamation-triangle me-2"></i>
              {{ errorMessage }}
            </div>

            <!-- Loading State -->
            <div *ngIf="isLoading" class="text-center py-4">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <div class="mt-2">Loading buildings...</div>
            </div>

            <!-- Buildings List -->
            <div *ngIf="!isLoading && buildings.length > 0" class="row g-3">
              <div *ngFor="let building of buildings" class="col-12">
                <div class="card h-100 border-start border-primary border-3">
                  <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                      <div class="flex-grow-1">
                        <h6 class="card-title mb-2">
                          <i class="bi bi-building me-2 text-primary"></i>
                          {{ building.name }}
                        </h6>

                        <div class="mb-2" *ngIf="building.location">
                          <small class="text-muted">
                            <i class="bi bi-geo-alt me-1"></i>
                            {{ building.location }}
                          </small>
                        </div>

                        <div class="mb-2">
                          <span class="badge bg-primary bg-opacity-10 text-primary">
                            <i class="bi bi-list-check me-1"></i>
                            {{ building?.checklistItems?.length }} checklist items
                          </span>
                        </div>
                      </div>

                      <div class="text-end">
                        <div class="building-status">
                          <i class="bi bi-check-circle text-success" title="Active building"></i>
                        </div>
                      </div>
                    </div>

                    <!-- Building Details -->
                    <div class="row g-2 text-sm">
                      <div class="col-6">
                        <small class="text-muted">
                          <strong>Created:</strong><br>
                          {{ building.createdAt | date:'short' }}
                        </small>
                      </div>
                      <div class="col-6">
                        <small class="text-muted">
                          <strong>Updated:</strong><br>
                          {{ building.updatedAt | date:'short' }}
                        </small>
                      </div>
                    </div>

                    <!-- Checklist Preview -->
                    <div *ngIf="building?.checklistItems?.length" class="mt-3">
                      <small class="text-muted d-block mb-2">
                        <strong>Sample Checklist Items:</strong>
                      </small>
                      <div class="checklist-preview">
                        <div *ngFor="let item of building.checklistItems.slice(0, 3)" class="small text-muted mb-1">
                          <i class="bi"
                             [class]="getQuestionTypeIcon(item.type)"
                             class="me-1"></i>
                          {{ item.question }}
                        </div>
                        <div *ngIf="building.checklistItems.length > 3" class="small text-muted fst-italic">
                          ... and {{ building.checklistItems.length - 3 }} more items
                        </div>
                      </div>
                    </div>

                    <!-- Empty checklist message -->
                    <div *ngIf="building.checklistItems.length === 0" class="mt-3">
                      <small class="text-muted fst-italic">
                        <i class="bi bi-info-circle me-1"></i>
                        No checklist items configured yet
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div *ngIf="!isLoading && buildings.length === 0" class="text-center py-5">
              <i class="bi bi-building" style="font-size: 3rem; color: var(--gray-400);"></i>
              <h5 class="mt-3 text-muted">No Buildings Found</h5>
              <p class="text-muted">No buildings have been added to the system yet.</p>
            </div>
          </div>

          <div class="modal-footer">
            <div class="d-flex justify-content-between align-items-center w-100">
              <small class="text-muted">
                <i class="bi bi-info-circle me-1"></i>
                {{ buildings.length }} total buildings
              </small>
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
            </div>
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

    .card {
      transition: all var(--transition-fast);
      border: 1px solid var(--gray-200);
      border-radius: var(--border-radius);
    }

    .card:hover {
      box-shadow: var(--shadow-md);
      transform: translateY(-1px);
    }

    .building-status i {
      font-size: 1.2rem;
    }

    .checklist-preview {
      background-color: var(--gray-50);
      border-radius: var(--border-radius-sm);
      padding: var(--spacing-2);
      max-height: 120px;
      overflow-y: auto;
    }

    .badge {
      font-size: 0.75rem;
      padding: 0.25rem 0.5rem;
    }

    .text-sm {
      font-size: 0.875rem;
    }

    @media (max-width: 576px) {
      .modal-dialog {
        margin: 0.5rem;
      }
    }
  `]
})
export class AllBuildingsModalComponent implements OnInit {
  @Input() userRole: string = 'TECHNICIAN'; // Can be 'TECHNICIAN' or 'ADMIN'

  buildings: Building[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  private modal: any;

  constructor(private buildingService: BuildingService) {}

  ngOnInit() {
    this.initializeModal();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initializeModal();
    }, 100);
  }

  initializeModal() {
    if (typeof bootstrap !== 'undefined') {
      const modalElement = document.getElementById('allBuildingsModal');
      if (modalElement) {
        this.modal = new bootstrap.Modal(modalElement);
      }
    }
  }

  loadBuildings() {
    this.isLoading = true;
    this.errorMessage = '';

    this.buildingService.getBuildings().subscribe({
      next: (buildings) => {
        this.buildings = buildings;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading buildings:', error);
        this.errorMessage = 'Failed to load buildings. Please try again.';
        this.isLoading = false;
      }
    });
  }

  show() {
    if (this.modal) {
      this.loadBuildings(); // Load fresh data when modal opens
      this.modal.show();
    }
  }

  hide() {
    if (this.modal) {
      this.modal.hide();
    }
  }

  getQuestionTypeIcon(type: string): string {
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
}
