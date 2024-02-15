import { Component } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { ApiService } from '../../services/api.service';
@Component({
  selector: 'app-absence-management',
  standalone: true,
  imports: [MatCardModule, MatDatepickerModule],
  templateUrl: './absence-management.component.html',
  styleUrl: './absence-management.component.scss',
})
export class AbsenceManagementComponent {
  selectedDate: Date | null = null;

  onDateSelect(date: Date): void {
    this.selectedDate = date;
    // Logic to handle date selection
    console.log('Selected date: ', date);
  }

  constructor(private apiService: ApiService) {
    // ... (existing constructor code)
  }

  validateAbsence() {
    if (this.selectedDate) {
      this.apiService.recordAbsence(this.selectedDate).subscribe((response) => {
        // Handle response
      });
    }
  }
}
