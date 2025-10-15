import { Routes } from '@angular/router';
import {LoginComponent} from "./pages/login/login.component";
import {DashboardComponent} from "./pages/dashboard/dashboard.component";
import {authGuard} from "./guards/auth.guard";
import {BuildingManagementComponent} from "./pages/building-management/building-management.component";
import {AddBuildingComponent} from "./pages/add-building/add-building.component";
import {EditBuildingComponent} from "./pages/edit-building/edit-building.component";
import { adminRoleGuard } from './guards/admin-role.guard';


export const routes: Routes = [
  { path: 'login', component: LoginComponent, title: 'Login' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard, adminRoleGuard], title: 'Dashboard' },// You can add route guards here,
  {
    path: 'buildings',
    component: BuildingManagementComponent,
    canActivate: [authGuard, adminRoleGuard],
    title: 'Building Management'
  },
  {
    path: 'buildings/new',
    component: AddBuildingComponent,
    canActivate: [authGuard],
    title: 'Add Building'
  },
  {
    path: 'buildings/edit/:id', // The ':id' is a route parameter
    component: EditBuildingComponent,
    canActivate: [authGuard],
    title: 'Edit Building'
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, // Redirect to dashboard by default
];
