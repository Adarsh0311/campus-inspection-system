import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataCategory, DataCategoryRequest } from '../models/data-category.model';
import { AuthService } from './auth.service';
import { Data } from '@angular/router';
import { environment } from '../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class DataCategoryService {

  private apiUrl = `${environment.baseUrl}/data-categories`;
  constructor(private http: HttpClient, private authService: AuthService) { }

  createCategory(data: DataCategoryRequest): Observable<DataCategory> {
    return this.http.post<DataCategory>(this.apiUrl, data, { headers: this.getAuthHeaders() });
  }

  getAllCategories(): Observable<DataCategory[]> {
    return this.http.get<DataCategory[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  getAuthHeaders() {
    return this.authService.getAuthHeaders();
  }

  deleteCategory(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}
