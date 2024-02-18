import { Component } from '@angular/core';
import { Match } from '../../interfaces/match';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CustomDatePipe } from '../../pipe/date.pipe';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-matches',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    MatButtonModule,
    MatFormFieldModule,
    CommonModule,
    MatInputModule,
    ReactiveFormsModule,
    CustomDatePipe,
    MatCardModule,
  ],
  templateUrl: './matches.component.html',
  styleUrl: './matches.component.scss',
})
export class MatchesComponent {
  matches: Match[] = [];
  newMatchForm: FormGroup;
  constructor(private apiService: ApiService, private fb: FormBuilder) {
    this.newMatchForm = this.fb.group({
      opponent: ['', [Validators.required]],
      date: ['', [Validators.required]],
      heure: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.apiService.getMatches().subscribe((response: Match[]) => {
      this.matches = response;
    });
  }

  onPost() {
    if (this.newMatchForm.valid) {
      let match = {
        date:
          this.newMatchForm.value.date + ' ' + this.newMatchForm.value.heure,
        opponent: this.newMatchForm.value.opponent,
      };
      this.apiService.postMatch(match).subscribe((data) => {
        this.matches.push(data.match);
      });
    }
  }
}
