import { AfterViewChecked, Component } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { ApiService } from '../../services/api.service';
import { MatButtonModule } from '@angular/material/button';
import { NgxMultipleDatesModule } from 'ngx-multiple-dates'; // module import
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { Match } from '../../interfaces/match';
import { CustomDatePipe } from '../../pipe/date.pipe';
// import { enUS } from 'date-fns/locale';

@Component({
  selector: 'app-absence-management',
  standalone: true,
  templateUrl: './absence-management.component.html',
  styleUrl: './absence-management.component.scss',
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatIconModule,
    MatInputModule,
    MatToolbarModule,
    NgxMultipleDatesModule,
    CustomDatePipe,
  ],
})
export class AbsenceManagementComponent {
  dateAbsences?: Date[];
  matches: Match[] = [];

  constructor(private apiService: ApiService) {
    this.apiService.getAbsences().subscribe((absences) => {
      this.dateAbsences = absences.map(
        (absence) => new Date(absence.date_of_absence),
      );
    });
    this.apiService.getMatches().subscribe((matches) => {
      this.matches = matches;
    });
  }

  validateAbsence() {
    if (this.dateAbsences) {
      this.apiService.postAbsence(this.dateAbsences);
    }
  }
}
