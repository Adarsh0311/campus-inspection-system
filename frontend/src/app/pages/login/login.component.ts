import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import {FormsModule} from "@angular/forms"; // 1. Import the service
import {CommonModule, NgOptimizedImage} from "@angular/common";


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

  // 2. Inject AuthService and Router in the constructor
  constructor(private authService: AuthService, private router: Router) {}

  handleSubmit() {
    this.error = '';

    this.authService.login(this.email, this.password).subscribe({
      // This 'next' function is called on a successful API response
      next: () => {
        // 4. Redirect to the dashboard on successful login
        this.router.navigate(['/dashboard']);
      },
      // This 'error' function is called if the API returns an error
      error: (err) => {
        this.error = 'Login failed. Please check your credentials.';
        console.error(err);
      }
    });
  }
}
