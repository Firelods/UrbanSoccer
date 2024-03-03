import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterModule, MatButtonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  mailUser?: string;
  role?: string;
  name?: string;
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    let sessionToken = this.authService.getToken();
    // decode jwt token to get user email
    if (sessionToken) {
      let mail = this.authService.getEmail();
      if (!mail) {
        return;
      }
      this.mailUser = mail;
      let name = this.authService.getName();
      if (!name) {
        return;
      }
      this.name = name;
      let role = this.authService.getRole();
      if (!role) {
        return;
      }
      this.role = role;
    }
  }

  disconnect() {
    this.authService.logout();
    this.router.navigate(['login']);
  }
}
