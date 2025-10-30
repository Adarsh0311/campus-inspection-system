import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { BuildingService } from '../../services/building.service';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../components/empty-state/empty-state.component';
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    PageHeaderComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  // Statistics
  totalBuildings: number = 0;
  completedInspections: number = 0;
  pendingInspections: number = 0;
  totalUsers: number = 2;

  // Recent data
  recentBuildings: any[] = [];
  isLoadingBuildings: boolean = true;

  constructor(private buildingService: BuildingService, private userService: UserService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.getUsersCount();
    this.loadBuildings();
    this.loadStatistics();
  }

  loadBuildings() {
    this.isLoadingBuildings = true;

    this.buildingService.getBuildings().subscribe({
      next: (buildings) => {
        this.totalBuildings = buildings.length;
        // Get the 5 most recent buildings
        this.recentBuildings = buildings
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5);
        this.isLoadingBuildings = false;
      },
      error: (error) => {
        console.error('Error loading buildings:', error);
        this.isLoadingBuildings = false;
      }
    });
  }

  loadStatistics() {
    // Mock data - replace with actual API calls
    this.completedInspections = 24;
    this.pendingInspections = 8;
  }

  getUsersCount() {
    this.userService.getTotalUsers().subscribe({
      next: (count) => {
        this.totalUsers = count;
      },
      error: (error) => {
        console.error('Error loading user count:', error);
      }
    });
  }

  generateReport() {
    // Implement report generation logic
    console.log('Generating report...');
    alert('Report generation feature coming soon!');
  }
}
