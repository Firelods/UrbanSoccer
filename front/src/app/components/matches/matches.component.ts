import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
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
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CustomDatePipe } from '../../pipe/date.pipe';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../services/auth.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';

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
    MatProgressBarModule,
    FormsModule,
  ],
  templateUrl: './matches.component.html',
  styleUrl: './matches.component.scss',
})
export class MatchesComponent {
  matches: Match[] = [];
  newMatchForm: FormGroup;
  isAdmin: boolean;
  matchModify: Match | null = null;
  modifying: boolean = false;
  dateOfMatchToModify: string = '';
  @ViewChild('datetime') datetime: any;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private authService: AuthService,
    private changeDetector: ChangeDetectorRef,
  ) {
    this.newMatchForm = this.fb.group({
      opponent: ['', [Validators.required]],
      date: ['', [Validators.required]],
      heure: ['', [Validators.required]],
    });
    this.isAdmin = this.authService.isAdmin();
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

  modify(match: Match) {
    this.matchModify = match;
    this.changeDetector.detectChanges();
    this.dateOfMatchToModify = new Date(this.matchModify.date)
      .toISOString()
      .split('.')[0];
    this.datetime.nativeElement.value = this.dateOfMatchToModify;
  }

  validate() {
    if (this.matchModify) {
      this.matchModify.date = new Date(this.datetime.nativeElement.value);
    }
    if (this.matchModify && this.matchModify.id) {
      this.modifying = true;
      this.apiService
        .putMatch(this.matchModify.id, this.matchModify)
        .subscribe((data) => {
          this.matchModify = null;
          this.modifying = false;
        });
    }
  }
}
