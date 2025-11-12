import {Component, OnInit} from '@angular/core';
import {ChecklistItem} from "../../models/building";
import {BuildingService} from "../../services/building.service";
import {ActivatedRoute, Router, RouterModule} from "@angular/router";
import {UpdateBuildingPayload} from "../../models/building";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-edit-building',
  standalone: true,
  imports: [FormsModule ,CommonModule, RouterModule],
  templateUrl: './edit-building.component.html',
  styleUrl: './edit-building.component.css'
})

export class EditBuildingComponent implements OnInit {
  // Form state
  buildingId = '';
  buildingName = '';
  buildingLocation = '';
  checklistItems: ChecklistItem[] = [];
  buildingStatus!: boolean;

  // State for the "add new item" sub-form
  newQuestion = '';
  newQuestionType: 'NUMERIC' | 'BOOLEAN' | 'TEXT' = 'BOOLEAN';

  // State to hold the original checklist for comparison on save
  private originalChecklist: ChecklistItem[] = [];

  isLoading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    protected router: Router,
    private buildingService: BuildingService
  ) {}

  ngOnInit(): void {
    // Get the building ID from the URL parameter
    this.buildingId = this.route.snapshot.paramMap.get('id')!;
    if (this.buildingId) {
      this.loadBuildingData();
    } else {
      this.errorMessage = "Building ID not found in URL.";
      this.isLoading = false;
    }
  }

  loadBuildingData(): void {
    this.isLoading = true;
    this.buildingService.getBuildingById(this.buildingId).subscribe({
      next: (data) => {
        this.buildingName = data.name;
        this.buildingLocation = data.location || '';
        this.checklistItems = data.checklistItems || [];
        this.buildingStatus = data.isActive;
        // IMPORTANT: Make a deep copy of the original state for later comparison
        this.originalChecklist = JSON.parse(JSON.stringify(data.checklistItems || []));
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load building data.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  // Method to add a new checklist item to our temporary list
  handleAddItem(): void {
    if (!this.newQuestion.trim()) return;
    // Note: New items do not have an 'id'
    this.checklistItems.push({
      question: this.newQuestion,
      type: this.newQuestionType,
    });
    // Clear the form for the next item
    this.newQuestion = '';
  }

  // Method to remove an item from the list by its index
  handleRemoveItem(index: number): void {
    this.checklistItems.splice(index, 1);
  }

  // Main save method that constructs the efficient payload
  handleSaveChanges(): void {
    // Get the IDs of the original and current checklist items
    const originalIds = new Set(this.originalChecklist.map(item => item.id));
    const currentIds = new Set(this.checklistItems.map(item => item.id).filter(Boolean));

    const payload: UpdateBuildingPayload = {
      name: this.buildingName,
      location: this.buildingLocation,
      isActive: this.buildingStatus,
      checklistItems: {
        // Items in the current list that don't have an ID are new
        create: this.checklistItems.filter(item => !item.id),
        // Items that existed originally and still exist now
        update: this.checklistItems.filter(item => item.id && originalIds.has(item.id)),
        // Original item IDs that are no longer in the current list
        delete: this.originalChecklist.filter(item => item.id && !currentIds.has(item.id)).map(item => item.id!),
      }
    };

    this.buildingService.updateBuilding(this.buildingId, payload).subscribe({
      next: () => {
        this.router.navigate(['/buildings']);
      },
      error: (err) => {
        this.errorMessage = "Failed to update building.";
        console.error(err);
      }
    });
  }

  // --- NEW: Method to handle inline edits of checklist items ---
  handleItemChange(index: number, field: 'question' | 'type', value: any ): void {
    // Create a new copy of the array to avoid direct state mutation
    const updatedItems = [...this.checklistItems];
    // Update the specific field of the specific item
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    // Set the state with the new array
    this.checklistItems = updatedItems;
  }

  trackByItemId(index: number, item: ChecklistItem): string | number {
    return item.id || index; // Use the unique DB id if it exists, otherwise use the array index
  }
}
