import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../models/user.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService, UserPayload } from '../../services/auth.service';
import { BackButtonComponent } from '../back-button/back-button.component';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [FormsModule, CommonModule, BackButtonComponent],
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  user!: User;
  currentUser: UserPayload | null = null;

  roles = ['TECHNICIAN', 'ADMIN'];

  successMessage = '';
  errorMessage = '';

  constructor(private userService: UserService, private route: ActivatedRoute, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUserValue;

    const userId = this.route.snapshot.paramMap.get('id');
    if (userId) {
      this.userService.getUserById(userId).subscribe({
        next: (user: User) => {
          this.user = user;
        },
        error: (err: HttpErrorResponse) => {
          this.errorMessage = err.error.error || 'Failed to load user data.';
          console.error(err);
        }
      });
    }
  }

  handleSubmit(): void {
    this.successMessage = '';
    this.errorMessage = '';

    const userData = {
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email,
      role: this.user.role,
      isActive: this.user.isActive
    };

    this.userService.updateUser(this.user.id, userData).subscribe({
      next: (response: any) => {
        console.log('User updated successfully:', response);
        this.successMessage = 'User updated successfully!';
        
        setTimeout(() => {
          this.router.navigate(['/users']);
        }, 2000);
      },

      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.error.error || 'Failed to update user. The email may already be in use.';
        console.error(err);
      }
    });
  }
}
