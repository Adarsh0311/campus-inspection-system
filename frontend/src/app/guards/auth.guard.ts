import {CanActivateFn, Router} from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from "../services/auth.service";

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);

  // Check if user is authenticated
  if (authService.isLoggedIn()) {
    return true;
  }

  // If not authenticated, redirect to login page
  const router = inject(Router);
  router.navigate(['/login']);
  return false;
};
