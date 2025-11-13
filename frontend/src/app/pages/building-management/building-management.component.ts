import { Component, OnInit } from '@angular/core';
import { Building } from "../../models/building";
import { BuildingService } from "../../services/building.service";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../components/empty-state/empty-state.component';

@Component({
  selector: 'app-building-management',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, PageHeaderComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent],
  templateUrl: './building-management.component.html',
  styleUrls: ['./building-management.component.css']
})
export class BuildingManagementComponent implements OnInit {

  buildings: Building[] = [];
  isLoading = true;
  errorMessage = '';
  filterBuildingName = '';
  filteredBuildings: Building[] = [];

  // For the "Add New" form
  newBuildingName = '';
  newBuildingLocation = '';

  constructor(private buildingService: BuildingService) { }

  // The ngOnInit is a "lifecycle hook" in Angular.
  // It runs automatically one time after the component is created.
  // It's the perfect place to fetch initial data.
  ngOnInit(): void {
    this.loadBuildings();
  }

  loadBuildings(): void {
    this.isLoading = true;
    this.buildingService.getAllBuildings().subscribe({
      next: (data) => {
        this.buildings = data;
        this.filteredBuildings = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load buildings. You may not be authorized.';
        this.isLoading = false;
      }
    });
  }

  onDeleteBuilding(id: string, name: string): void {
    // Use the browser's confirm dialog for a simple confirmation
    if (confirm(`Are you sure you want to delete the building "${name}"?`)) {
      this.buildingService.deleteBuilding(id).subscribe({
        next: () => {
          // On success, filter out the deleted building from the local array
          // to instantly update the UI without a full reload.
          this.buildings = this.buildings.filter(b => b.id !== id);
        },
        error: (err) => {
          this.errorMessage = 'Failed to delete building.';
          console.error(err);
        }
      });
    }
  }

  filterBuildings() {
    // This method can be expanded to implement filtering logic
    this.filteredBuildings = this.buildings.filter(b =>
      b.name.toLowerCase().includes(this.filterBuildingName.toLowerCase())
    );
  }

  clearFilters() {
    this.filterBuildingName = '';
    this.filteredBuildings = this.buildings;
  }

}
