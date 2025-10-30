import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { LoadingSpinnerComponent } from '../../components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../components/empty-state/empty-state.component';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    LoadingSpinnerComponent,
    EmptyStateComponent
  ],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  successMessage: string = '';

  // Filter properties
  searchTerm: string = '';
  selectedRole: string = '';
  selectedStatus: string = '';

  // Modal properties
  selectedUser: User | null = null;
  userToDelete: User | null = null;

  // Current user info
  currentUserId: string = '';

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {
    // Get current user ID to prevent self-deletion of admin
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.currentUserId = payload.userId;
    }
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.errorMessage = '';

    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.filteredUsers = [...users];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.errorMessage = 'Failed to load users. Please try again.';
        this.isLoading = false;
      }
    });
  }

  filterUsers() {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = !this.searchTerm || 
        (user.firstName + ' ' + user.lastName).toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesRole = !this.selectedRole || user.role === this.selectedRole;
      const matchesStatus = !this.selectedStatus || (user.isActive ? 'ACTIVE' : 'INACTIVE') === this.selectedStatus;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedRole = '';
    this.selectedStatus = '';
    this.filteredUsers = [...this.users];
  }

  refreshUsers() {
    this.loadUsers();
  }

  viewUserDetails(user: any) {
    this.selectedUser = user;
    // In a real app, you'd use a modal library or router
    // For now, we'll just log the user details
    console.log('View user details:', user);
  }

  toggleUserStatus(userId: string, newStatus: string) {
    const action = newStatus === 'ACTIVE' ? 'activate' : 'deactivate';
    
    if (confirm(`Are you sure you want to ${action} this user?`)) {
      this.userService.updateUserStatus(userId, newStatus).subscribe({
        next: () => {
          this.successMessage = `User ${action}d successfully.`;
          this.loadUsers();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (error) => {
          console.error('Error updating user status:', error);
          this.errorMessage = `Failed to ${action} user. Please try again.`;
          setTimeout(() => this.errorMessage = '', 5000);
        }
      });
    }
  }

  confirmDeleteUser(userId: string, userName: string) {
    const userToDelete = this.users.find(u => u.id === userId);
    if (userToDelete) {
      this.userToDelete = userToDelete;
      // In a real app, you'd open a modal here
      // For now, we'll use a confirm dialog
      if (confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
        this.deleteUser();
      }
    }
  }

  deleteUser() {
    if (this.userToDelete) {
      this.userService.deleteUser(this.userToDelete.id).subscribe({
        next: () => {
          this.successMessage = 'User deleted successfully.';
          this.userToDelete = null;
          this.loadUsers();
          setTimeout(() => this.successMessage = '', 3000);
        },
        error: (error) => {
          console.error('Error deleting user:', error);
          this.errorMessage = 'Failed to delete user. Please try again.';
          this.userToDelete = null;
          setTimeout(() => this.errorMessage = '', 5000);
        }
      });
    }
  }

  exportUsers() {
    // Simple CSV export
    // const headers = ['Name', 'Email', 'Role', 'Status', 'Created', 'Last Login'];
    // const csvContent = [
    //   headers.join(','),
    //   ...this.filteredUsers.map(user => [
    //     `"${user.name}"`,
    //     `"${user.email}"`,
    //     user.role,
    //     user.status,
    //     new Date(user.createdAt).toLocaleDateString(),
    //     user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'
    //   ].join(','))
    // ].join('\n');

    // const blob = new Blob([csvContent], { type: 'text/csv' });
    // const url = window.URL.createObjectURL(blob);
    // const link = document.createElement('a');
    // link.href = url;
    // link.download = `users-${new Date().toISOString().split('T')[0]}.csv`;
    // link.click();
    // window.URL.revokeObjectURL(url);
  }

  // Utility methods
  getUserInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }


  getRoleBadgeClass(role: string): string {
    switch (role) {
      case 'ADMIN':
        return 'bg-danger';
      case 'INSPECTOR':
        return 'bg-primary';
      case 'VIEWER':
        return 'bg-secondary';
      default:
        return 'bg-light text-dark';
    }
  }

  getRoleIcon(role: string): string {
    switch (role) {
      case 'ADMIN':
        return 'bi bi-shield-check';
      case 'INSPECTOR':
        return 'bi bi-clipboard-check';
      case 'VIEWER':
        return 'bi bi-eye';
      default:
        return 'bi bi-person';
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'ACTIVE':
        return 'bg-success';
      case 'INACTIVE':
        return 'bg-warning text-dark';
      default:
        return 'bg-secondary';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'ACTIVE':
        return 'bi bi-check-circle';
      case 'INACTIVE':
        return 'bi bi-pause-circle';
      default:
        return 'bi bi-question-circle';
    }
  }

  getTimeAgo(date: string): string {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      return `${Math.floor(diffDays / 7)} weeks ago`;
    } else {
      return `${Math.floor(diffDays / 30)} months ago`;
    }
  }

  isCurrentUser(userId: string): boolean {
    return userId === this.currentUserId;
  }
}