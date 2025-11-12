import { Component, OnInit } from '@angular/core';
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

export class LoginComponent implements OnInit{
  email = '';
  password = '';
  error = '';
  currentUser: UserPayload | null = null;

  // 2. Inject AuthService and Router in the constructor
  constructor(private authService: AuthService, private router: Router) {
    this.currentUser = this.authService.currentUserValue;
  }


  ngOnInit(): void {
    // Any initialization logic can go here
    this.navigate();
  }

  navigate() {
    this.currentUser = this.authService.currentUserValue;
     if (this.currentUser) {  
        if (this.currentUser.role === 'ADMIN') {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/inspector-dashboard']);
        }
      }
  }

  handleSubmit() {
    this.error = '';

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.navigate();
      },
      // This 'error' function is called if the API returns an error
      error: (err) => {
        this.error = err.error.error ? err.error.error : 'An error occurred during login.';
        console.error(err.error);
      }
    });
  }
}
