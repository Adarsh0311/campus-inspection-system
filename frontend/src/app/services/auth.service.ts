import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import {environment} from "../environment.development";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.baseUrl + '/auth';

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        // The 'tap' operator lets us perform a side effect (like saving to localStorage)
        // without changing the data that flows through the observable.
        tap(response => {
          if (response.token) {
            localStorage.setItem('authToken', response.token);
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('authToken');
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
