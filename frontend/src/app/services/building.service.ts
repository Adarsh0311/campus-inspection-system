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

  getAllBuildings(): Observable<Building[]> {
    return this.http.get<Building[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  getAllActiveBuildings(): Observable<Building[]> {
    return this.http.get<Building[]>(`${this.apiUrl}/active`, { headers: this.getAuthHeaders() });
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

  deleteBuilding(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  getBuildingChecklist(buildingId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${buildingId}/checklist-items`, { headers: this.getAuthHeaders() });
  }


}
