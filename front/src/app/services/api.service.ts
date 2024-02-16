import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:5000'; // URL to web API

  constructor(private http: HttpClient) {}

  // Example function to get team data
  getTeam() {
    return this.http.get(`${environment.apiUrl}/team`);
  }

  recordAbsence(date: Date) {
    return this.http.post(`${environment.apiUrl}/absences`, { date });
  }
}
