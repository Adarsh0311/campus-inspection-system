import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { BackButtonComponent } from '../pages/back-button/back-button.component';

@Component({
  selector: 'app-add-user-form',
  standalone: true,
  imports: [FormsModule, CommonModule, BackButtonComponent],
  templateUrl: './add-user-form.component.html',
  styleUrls: ['./add-user-form.component.css']
})
export class AddUserFormComponent {
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  roles = ['TECHNICIAN', 'ADMIN'];
  role = 'TECHNICIAN'; // Default role selection

  successMessage = '';
  errorMessage = '';

  constructor(private userService: UserService) {}

  handleSubmit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    const userData = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password,
      role: this.role
    };

    this.userService.createUser(userData).subscribe({
      next: (response: any) => {
        console.log('User created successfully:', response);
        this.successMessage = 'User created successfully!';
        // Clear the form
        this.firstName = '';
        this.lastName = '';
        this.email = '';
        this.password = '';
        this.role = 'TECHNICIAN'; // Reset to default role
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.error.error || 'Failed to create user. The email may already be in use.';
        console.error(err);
      }
    });
  }
}