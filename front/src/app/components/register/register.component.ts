import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';

import { AuthService } from '../../services/auth.service';
import { roles } from '../../role';
import { MatButtonModule } from '@angular/material/button';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    CommonModule,
    MatInputModule,
    RouterModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  registerForm: FormGroup;
  roles = Array.from(new Set(roles));
  registerValid: boolean = true;
  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      code: ['', [Validators.required]],
      role: ['', [Validators.required]],
      nom: ['', [Validators.required]],
    });
  }

  onRegister() {
    if (this.registerForm.valid) {
      this.authService
        .register(
          this.registerForm.value.email,
          this.registerForm.value.password,
          this.registerForm.value.code,
          this.registerForm.value.role,
          this.registerForm.value.nom
        )
        .pipe(
          catchError((error) => {
            if (error.status > 300) {
              this.registerValid = false;
            }
            // rethrow the error to be caught by the final subscribe block if needed
            return of(error);
          })
        )
        .subscribe((data) => {
          if (data.status > 300) {
            return;
          }
          this.authService.setSession(data);
          // Navigate to team overview or another route upon success
        });
    }
  }
}
