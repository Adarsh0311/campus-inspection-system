import { Routes } from '@angular/router';
import { LoginComponent } from "./pages/login/login.component";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { authGuard } from "./guards/auth.guard";
import { BuildingManagementComponent } from "./pages/building-management/building-management.component";
import { AddBuildingComponent } from "./pages/add-building/add-building.component";
import { EditBuildingComponent } from "./pages/edit-building/edit-building.component";
import { adminRoleGuard } from './guards/admin-role.guard';
import { AddUserFormComponent } from "./add-user-form/add-user-form.component";
import { UserManagementComponent } from "./pages/user-management/user-management.component";
import { InspectorDashboardComponent } from "./pages/inspector-dashboard/inspector-dashboard.component";
import { InspectionFormComponent } from "./pages/inspection-form/inspection-form.component";
import { InspectionHistoryComponent } from './pages/inspection-history/inspection-history.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { EditUserComponent } from './pages/edit-user/edit-user.component';
import { InspectionDetailComponent } from './pages/inspection-detail/inspection-detail.component';
import { EditInspectionComponent } from './pages/edit-inspection/edit-inspection.component';


export const routes: Routes = [
  { path: 'login', component: LoginComponent, title: 'Login' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard, adminRoleGuard], title: 'Dashboard' },
  {
    path: 'buildings',
    children: [
      { path: '', component: BuildingManagementComponent, canActivate: [authGuard, adminRoleGuard], title: 'Building Management' },
      { path: 'new', component: AddBuildingComponent, canActivate: [authGuard], title: 'Add Building' },
      { path: 'edit/:id', component: EditBuildingComponent, canActivate: [authGuard], title: 'Edit Building' },
    ]
  },

  {
    path: 'users', canActivate: [authGuard, adminRoleGuard],
    children: [
      { path: '', component: UserManagementComponent, title: 'User Management' },
      { path: 'new', component: AddUserFormComponent, title: 'Add User' },
      { path: 'edit/:id', component: EditUserComponent, title: 'Edit User' },
    ]
  },

  // Technician Routes (accessible by both Technician and ADMIN roles)
  { path: 'inspector-dashboard', component: InspectorDashboardComponent, canActivate: [authGuard], title: 'Technician Dashboard' },

  {
    path: 'inspection', canActivate: [authGuard],
    children: [
      { path: 'form', component: InspectionFormComponent, title: 'Inspection Form' },
      { path: 'history', component: InspectionHistoryComponent, title: 'Inspection History' },
      { path: 'detail/:id', component: InspectionDetailComponent, title: 'Inspection Detail' },
      { path: 'edit/:id', component: EditInspectionComponent, title: 'Edit Inspection' },
      // Add history component later when needed
    ]
  },

  { path: 'profile', component: ProfileComponent, canActivate: [authGuard], title: 'Profile' },

  { path: 'data-categories', loadComponent: () => import('./pages/data-category/data-category.component').then(m => m.DataCategoryComponent),
    canActivate: [authGuard, adminRoleGuard], title: 'Data Categories'
  },


  { path: '**', redirectTo: '/dashboard', pathMatch: 'full' }, // Redirect to dashboard by default
];
