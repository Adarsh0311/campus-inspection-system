import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from "../environment.development";


export interface UserPayload {
  userId: string;
  role: 'ADMIN' | 'TECHNICIAN';
  email: string;
  firstName: string;
  lastName: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.baseUrl + '/auth';

  // BehaviorSubject to hold the current user state
  private currentUserSubject = new BehaviorSubject<UserPayload | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable(); // The public observable components can subscribe to


  constructor(private http: HttpClient) {
    // When the service is first created, check if a user is already logged in
    const token = this.getToken();
    if (token && !this.isTokenExpired(token)) {
      this.currentUserSubject.next(this.decodeToken(token));
    }
  }

  public get currentUserValue(): UserPayload | null {
    return this.currentUserSubject.value;
  }

  private decodeToken(token: string): UserPayload | null {
    try {
      // Decode the middle part (payload) of the JWT
      const payload = JSON.parse(atob(token.split('.')[1]));
      return { userId: payload.userId, role: payload.role, email: payload.email, firstName: payload.firstName, lastName: payload.lastName };
    } catch (e) {
      return null;
    }
  }

  login(email: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        // The 'tap' operator lets us perform a side effect (like saving to localStorage)
        // without changing the data that flows through the observable.
        tap(response => {
          if (response.token) {
            localStorage.setItem('authToken', response.token);
            // When login is successful, update the subject with the new user data
            this.currentUserSubject.next(this.decodeToken(response.token));
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('authToken');
    // On logout, update the subject to null
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }


  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;
    return !this.isTokenExpired(token);
  }

  private isTokenExpired(token?: string): boolean {
    const t = token ?? this.getToken();
    if (!t) return true;

    try {
      const parts = t.split('.');
      if (parts.length !== 3) return true;

      const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const decoded = atob(payload);
      const parsed = JSON.parse(decoded);

      if (!parsed.exp) return true;

      const now = Math.floor(Date.now() / 1000);
      return parsed.exp < now;
    } catch {
      return true;
    }
  }
}
