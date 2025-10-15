import { Component } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {Router, RouterModule} from "@angular/router";
import { AddUserFormComponent } from "../../add-user-form/add-user-form.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, AddUserFormComponent, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  constructor(private authService: AuthService, private router: Router) {}

  activeTab: string = 'buildings'; // 'buildings' will be the default active tab

  setActiveTab(tabName: string) {
    this.activeTab = tabName;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
