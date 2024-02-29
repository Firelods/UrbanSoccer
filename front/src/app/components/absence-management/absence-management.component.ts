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
// import { enUS } from 'date-fns/locale';

@Component({
  selector: 'app-absence-management',
  standalone: true,
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
  ],
  templateUrl: './absence-management.component.html',
  styleUrl: './absence-management.component.scss',
})
export class AbsenceManagementComponent {
  dateAbsences?: Date[];

  constructor(private apiService: ApiService) {}

  validateAbsence() {
    if (this.dateAbsences) {
      this.apiService.postAbsence(this.dateAbsences);
    }
  }
}
