import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {AuthService, UserPayload} from '../../services/auth.service';
import {FormsModule} from "@angular/forms"; // 1. Import the service
import {CommonModule, NgOptimizedImage} from "@angular/common";
import {Observable} from "rxjs";


@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule, NgOptimizedImage],
  templateUrl: './login.component.html',
  standalone: true,
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  email = '';
  password = '';
  error = '';
  currentUser: UserPayload | null = null;

  // 2. Inject AuthService and Router in the constructor
  constructor(private authService: AuthService, private router: Router) {
    this.currentUser = this.authService.currentUserValue;
  }

  handleSubmit() {
    this.error = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.currentUser = this.authService.currentUserValue;
        if (this.currentUser?.role === 'ADMIN') {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/inspector-dashboard']);
        }
      },
      // This 'error' function is called if the API returns an error
      error: (err) => {
        this.error = err.error.error ? err.error.error : 'An error occurred during login.';
        console.error(err.error);
      }
    });
  }
}
