import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminRoleGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  try {
    // Decode the JWT payload
    const payload = JSON.parse(atob(token.split('.')[1]));

    if (payload.role === 'ADMIN') {
      return true; // Access granted
    } else {

      router.navigate(['/inspector-dashboard']); // Redirect non-admins
      return false;
    }
  } catch (e) {
    router.navigate(['/login']); // Invalid token
    return false;
  }

};
