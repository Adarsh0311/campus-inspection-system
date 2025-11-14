import { Component, OnInit } from '@angular/core';
import {ChecklistItem, CreateBuildingPayload} from "../../models/building";
import {BuildingService} from "../../services/building.service";
import {Router} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import { DataCategoryService } from '../../services/data-category.service';
import { DataCategory } from '../../models/data-category.model';

@Component({
  selector: 'app-add-building',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-building.component.html',
  styleUrl: './add-building.component.css'
})
export class AddBuildingComponent implements OnInit{

  // State for the main building details
  buildingName = '';
  buildingLocation = '';
  dataCategories: DataCategory[] = [];
  errorMessage: string = '';

  selectedCategories: DataCategory[] = [];

  // State for the dynamic list of checklist items
  checklistItems: Omit<ChecklistItem, 'id'>[] = [];

  // State for the "add new item" sub-form
  newQuestion = '';
  newQuestionType: 'NUMERIC' | 'BOOLEAN' | 'TEXT' = 'NUMERIC';
  buildingStatus: boolean = true;
  
  constructor(private buildingService: BuildingService, public router: Router, private dataCategoryService: DataCategoryService) {}

  ngOnInit(): void {
    this.dataCategoryService.getAllCategories().subscribe(
      (categories) => {
        this.dataCategories = categories;
      },
      (error) => {
        this.errorMessage = 'Error fetching data categories';
        console.error('Error fetching data categories', error);
      }
    );
  }

  // Method to add a new item to our temporary list
  handleAddItem(): void {
    if (this.selectedCategories.length === 0) return;

    console.log(this.selectedCategories);
    for (let category of this.selectedCategories) {
      if (this.checklistItems.find(item => item.question === category.name)) {
        continue; // Skip duplicates
      }

      this.checklistItems.push({
        question: category.name,
        type: category.type,
      });
    }
    // Clear the form for the next item
    //this.selectedCategories = [];
  }

  // Method to remove an item from the list
  handleRemoveItem(index: number): void {
    this.checklistItems.splice(index, 1);
  }

  // Method to save the entire building
  handleSaveBuilding(): void {
    if (!this.buildingName.trim()) {
      alert('Building name and location are required.');
      return;
    }

    if (!confirm('Are you sure you want to create this building?')) {
      return;
    }

    const payload: CreateBuildingPayload = {
      name: this.buildingName,
      location: this.buildingLocation,
      isActive: this.buildingStatus,
      checklistItems: this.checklistItems,
    };

    this.buildingService.createBuildingWithChecklist(payload).subscribe({
      next: () => {
        this.router.navigate(['/buildings']); // Navigate to the list on success
      },
      error: (err) => {
        console.error('Failed to create building', err);
        this.errorMessage = 'Failed to create building. Try using a different name.';
        //alert(this.errorMessage);
      }
    });
  }

  getSortedCategories(): any {
    return this.dataCategories.sort((a, b) => a.name.localeCompare(b.name));
}
}
