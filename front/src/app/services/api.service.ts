import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment';
import { Match } from '../interfaces/match';
import { Player } from '../interfaces/player';
import { Team } from '../interfaces/team';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:5000'; // URL to web API

  constructor(private http: HttpClient) {}

  // Example function to get team data
  getTeam(team_id: number) {
    return this.http.get<Team>(`${environment.apiUrl}/team/${team_id}`);
  }

  recordAbsence(date: Date) {
    return this.http.post(`${environment.apiUrl}/absences`, {
      date,
    });
  }

  getAvailablePlayersOnMatch(match: Match) {
    return this.http.get(
      `${environment.apiUrl}/absences/present?match_id=${match.id}`
    );
  }

  getMatches() {
    return this.http.get<Match[]>(`${environment.apiUrl}/matches`);
  }

  getMatch(id: number) {
    return this.http.get<Match>(`${environment.apiUrl}/matches/${id}`);
  }

  postMatch(match: any) {
    // set date format YYYY-MM-DD HH:MM
    return this.http.post<{ message: string; match: Match }>(
      `${environment.apiUrl}/matches`,
      match
    );
  }

  createTeam(match: Match) {
    return this.http.post<{ message: string; team: Team }>(
      `${environment.apiUrl}/team/random`,
      { match_id: match.id }
    );
  }
}
