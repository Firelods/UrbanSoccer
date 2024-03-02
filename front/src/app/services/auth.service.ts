import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {}

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
    name: string
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

  getToken() {
    return localStorage.getItem('id_token');
  }
}
