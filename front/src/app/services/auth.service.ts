import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../environment';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  login(email: string, password: string) {
    return this.http.post<any>(`${environment.apiUrl}/auth/login`, {
      email,
      password,
    });
  }

  register(
    email: string,
    password: string,
    code: string,
    role: string,
    name: string,
  ) {
    return this.http.post<any>(`${environment.apiUrl}/auth/register`, {
      email,
      password,
      special_password: code,
      role,
      name,
    });
  }

  setSession(authResult: any) {
    // Set the token in local storage
    if (!authResult.token) {
      console.error('Inscription eronée');
      return;
    }
    localStorage.setItem('id_token', authResult.token);
    this.loggedIn.next(true);
    this.router.navigate(['/matches']);
  }

  logout() {
    localStorage.removeItem('id_token');
    this.loggedIn.next(false);
  }

  isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  isAdmin(): boolean {
    // decode token and check if additional claim admin is true
    let token = this.getToken();
    if (!token) {
      return false;
    }
    try {
      let decodedToken: any = jwtDecode(token);
      if (decodedToken && decodedToken.admin) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error decoding token', error);
    }
    return false;
  }

  getEmail(): string | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    try {
      const decodedToken = jwtDecode(token);

      if (decodedToken && decodedToken.sub) {
        return decodedToken.sub;
      }
    } catch (error) {
      console.error('Error decoding token', error);
    }
    return null;
  }

  getName(): string | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    try {
      const decodedToken: any = jwtDecode(token);

      if (decodedToken && decodedToken.name) {
        return decodedToken.name;
      }
    } catch (error) {
      console.error('Error decoding token', error);
    }
    return null;
  }

  getRole(): string | null {
    const token = this.getToken();
    if (!token) {
      return null;
    }
    try {
      const decodedToken: any = jwtDecode(token);

      if (decodedToken && decodedToken.role) {
        return decodedToken.role;
      }
    } catch (error) {
      console.error('Error decoding token', error);
    }
    return null;
  }

  getToken() {
    return localStorage.getItem('id_token');
  }
}
