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
  constructor(private authService: AuthService, private router: Router) {
    let sessionToken = this.authService.getToken();
    // decode jwt token to get user email
    if (sessionToken) {
      try {
        const decodedToken = jwtDecode(sessionToken);

        if (decodedToken && decodedToken.sub) {
          this.mailUser = decodedToken.sub;
        }
      } catch (error) {
        console.error('Error decoding token', error);
      }
    }
  }

  disconnect() {
    this.authService.logout();
    this.router.navigate(['login']);
  }
}
