import { Routes } from '@angular/router';
import {LoginComponent} from "./pages/login/login.component";


export const routes: Routes = [
  { path: 'login', component: LoginComponent }, // 2. Add the route
  { path: '', redirectTo: '/login', pathMatch: 'full' } // Redirect empty path to login
];
