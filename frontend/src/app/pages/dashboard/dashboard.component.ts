import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { BuildingService } from '../../services/building.service';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../components/empty-state/empty-state.component';
import {UserService} from "../../services/user.service";
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { timeout } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { AuthService } from '../../services/auth.service';

declare var bootstrap: any;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    PageHeaderComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    FormsModule
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

  startDate: string = '';
  endDate: string = '';
  buildingIds: string[] = ['All'];

  private modalInstance: any;

  constructor(private buildingService: BuildingService, private userService: UserService, private http: HttpClient, private auth: AuthService) {}

  ngOnInit() {
    this.loadDashboardData();
    this.initializeModal();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.initializeModal();
    }, 100);
    
  }

  initializeModal() {
        //initialize bootstrap modal
    var reportModalEl = document.getElementById('reportModal');
    if (reportModalEl) {
      this.modalInstance = new bootstrap.Modal(reportModalEl);
    }
  }

  loadDashboardData() {
    //this.getUsersCount();
    this.loadBuildings();
    //this.loadStatistics();
  }

  loadBuildings() {
    this.isLoadingBuildings = true;

    this.buildingService.getAllBuildings().subscribe({
      next: (buildings) => {
        this.totalBuildings = buildings.length;
        this.recentBuildings = buildings;
      },
      error: (err: any) => {
        console.error('Error loading buildings:', err);
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

  showModal() {
    if (this.modalInstance) {
      this.modalInstance.show();
    } 
  }

  generateReport() {

    if (!this.startDate || !this.endDate) {
      alert('Please select both start and end dates for the report.');
      return;
    }

    const body = {
      startDate: this.startDate,
      endDate: this.endDate,
      buildingIds: this.buildingIds
    };


    const url = environment.baseUrl + '/report';
    this.http.post(url, body, { responseType: 'blob', headers: { Authorization: `Bearer ${this.auth.getToken()}` } }).subscribe({
      next: (response: Blob) => {
        const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `inspection-report-${this.startDate}-to-${this.endDate}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        console.log('Report downloaded successfully');

        this.modalInstance.hide();

      },
      error: (error) => {
        console.error('Error generating report:', error);
        alert('Error generating report');
      }
    });
  }
}
