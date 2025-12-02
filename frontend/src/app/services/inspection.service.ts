import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../environments/environment.development";
import {CreateInspectionRequest} from "../models/inspection.model";
import {AuthService} from "./auth.service";

export interface InspectionData {
  id: string;
  buildingId: string;
  userId: string;
  user: string;
  date: string;
  building?: { name:string };
  answers: [
    {question: string, textAnswer: any}
  ]
}

export interface InspectionResponse {
  questionId: string;
  question: string;
  type: 'BOOLEAN' | 'NUMERIC' | 'TEXT';
  answer: any;
}


export interface ChecklistItem {
  id: string;
  question: string;
  type: 'BOOLEAN' | 'NUMERIC' | 'TEXT';
  required: boolean;
  order: number;
}

@Injectable({
  providedIn: 'root'
})
export class InspectionService {
  private apiUrl = environment.baseUrl + '/inspections';

  constructor(private http: HttpClient, private authService: AuthService) {}


  updateInspection(id: string, inspectionData: Partial<InspectionData>): Observable<InspectionData> {
    return this.http.put<InspectionData>(`${this.apiUrl}/${id}`, inspectionData, { headers: this.getAuthHeaders() });
  }

  getInspectionById(id: string): Observable<InspectionData> {
    return this.http.get<InspectionData>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }


  deleteInspection(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  createInspection(createInspectionRequest: CreateInspectionRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, createInspectionRequest, { headers: this.getAuthHeaders() });
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getInspectionsByBuildingWithDateRange(buildingId: string, userId: string, startDate?: string, endDate?: string): Observable<InspectionData[]> {
    let url = `${this.apiUrl}/buildings/${buildingId}`;
    const params = new URLSearchParams();
    if (startDate) {
      params.append('startDate', startDate);
    }
    if (endDate) {
      params.append('endDate', endDate);
    }

    if (userId && userId !== 'All') {
      params.append('userId', userId);
    }

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    return this.http.get<InspectionData[]>(url, { headers: this.getAuthHeaders() });
  }
}