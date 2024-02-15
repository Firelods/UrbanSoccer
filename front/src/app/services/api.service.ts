import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:5000'; // URL to web API

  constructor(private http: HttpClient) {}

  // Example function to get team data
  getTeam() {
    return this.http.get(`${this.apiUrl}/team`);
  }

  recordAbsence(date: Date) {
    return this.http.post(`${this.apiUrl}/absences`, { date });
  }
}
