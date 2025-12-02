import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../environments/environment.development';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.baseUrl + '/users';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Method for an Admin to create a new user
  createUser(userData: { firstName: string; lastName: string; email: string; }): Observable<any> {
    return this.http.post(`${this.apiUrl}`, userData, { headers: this.getAuthHeaders() });
  }

  getTotalUsers(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/count`, { headers: this.getAuthHeaders() });
  }

  getAllUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`, { headers: this.getAuthHeaders() });
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}`, { headers: this.getAuthHeaders() });
  }

  getUserById(userId: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${userId}`, { headers: this.getAuthHeaders() });
  }

  updateUser(id: string, userData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, userData, { headers: this.getAuthHeaders() });
  }
  resetPassword(id: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${id}/reset-password`, {}, { headers: this.getAuthHeaders() });
  }

  updateUserStatus(id: string, status: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/status`, { status }, { headers: this.getAuthHeaders() });
  }
}
