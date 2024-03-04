import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment';
import { Match } from '../interfaces/match';
import { Player } from '../interfaces/player';
import { Team } from '../interfaces/team';
import { Absence } from '../interfaces/absence';
import { Observable } from 'rxjs';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(
    private eventService: NotificationService,
    private http: HttpClient,
  ) {}

  someFunction() {
    // When you want to show a snackbar
    this.eventService.sendSnackBarMessage('Your message');
  }
  // Example function to get team data
  getTeam(team_id: number) {
    return this.http.get<Team>(`${environment.apiUrl}/team/${team_id}`);
  }

  getAvailablePlayersOnMatch(match: Match) {
    return this.http.get(
      `${environment.apiUrl}/absences/present?match_id=${match.id}`,
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
      match,
    );
  }

  createTeam(match: Match) {
    return this.http.post<{ message: string; team: Team }>(
      `${environment.apiUrl}/team/random`,
      { match_id: match.id },
    );
  }

  private recordAbsence(date: Date) {
    // make date format YYYY-MM-DD
    const dateStr = date.toISOString().split('T')[0];

    return this.http.post(`${environment.apiUrl}/absences`, {
      date: dateStr,
    });
  }

  postAbsence(absence: Date[]) {
    // get actual absences and for each new absence, post it
    this.getAbsences().subscribe((absences) => {
      absence.forEach((date) => {
        if (!absences.find((a) => a.date_of_absence === date)) {
          this.recordAbsence(date).subscribe(() => {
            this.eventService.sendSnackBarMessage(
              `Absence enregistrée pour le ${date}\n`,
            );
          });
        }
      });
    });
  }

  getAbsences(): Observable<Absence[]> {
    return this.http.get<Absence[]>(`${environment.apiUrl}/absences`);
  }

  getAbsenceToMatch(match_id: number) {
    return this.http.get<Player[]>(
      `${environment.apiUrl}/absences/absent?match_id=${match_id}`,
    );
  }
}
