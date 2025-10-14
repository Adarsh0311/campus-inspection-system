import { Component } from '@angular/core';
import {ChecklistItem, CreateBuildingPayload} from "../../models/building";
import {BuildingService} from "../../services/building.service";
import {Router} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-add-building',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-building.component.html',
  styleUrl: './add-building.component.css'
})
export class AddBuildingComponent {
  // State for the main building details
  buildingName = '';
  buildingLocation = '';

  // State for the dynamic list of checklist items
  checklistItems: Omit<ChecklistItem, 'id'>[] = [];

  // State for the "add new item" sub-form
  newQuestion = '';
  newQuestionType: 'NUMERIC' | 'BOOLEAN' | 'TEXT' = 'BOOLEAN';

  constructor(private buildingService: BuildingService, public router: Router) {}

  // Method to add a new item to our temporary list
  handleAddItem(): void {
    if (!this.newQuestion.trim()) return;
    this.checklistItems.push({
      question: this.newQuestion,
      type: this.newQuestionType,
    });
    // Clear the form for the next item
    this.newQuestion = '';
  }

  // Method to remove an item from the list
  handleRemoveItem(index: number): void {
    this.checklistItems.splice(index, 1);
  }

  // Method to save the entire building
  handleSaveBuilding(): void {
    const payload: CreateBuildingPayload = {
      name: this.buildingName,
      location: this.buildingLocation,
      checklistItems: this.checklistItems,
    };

    this.buildingService.createBuildingWithChecklist(payload).subscribe({
      next: () => {
        this.router.navigate(['/buildings']); // Navigate to the list on success
      },
      error: (err) => {
        console.error('Failed to create building', err);
        alert('Failed to create building.');
      }
    });
  }
}
