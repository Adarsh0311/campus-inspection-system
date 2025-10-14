import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import {Building, CreateBuildingPayload, UpdateBuildingPayload} from "../models/building";
import {environment} from "../environment.development";


@Injectable({
  providedIn: 'root'
})
export class BuildingService {
  private apiUrl = environment.baseUrl + '/buildings';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getBuildings(): Observable<Building[]> {
    return this.http.get<Building[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  // --- NEW: Method for creating a building with its checklist ---
  createBuildingWithChecklist(payload: CreateBuildingPayload): Observable<Building> {
    return this.http.post<Building>(this.apiUrl, payload, { headers: this.getAuthHeaders() });
  }

  getBuildingById(id: string): Observable<Building> {
    return this.http.get<Building>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  updateBuilding(id: string, payload: UpdateBuildingPayload): Observable<Building> {
    return this.http.put<Building>(`${this.apiUrl}/${id}`, payload, { headers: this.getAuthHeaders() });
  }


}
