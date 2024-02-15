import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authUrl = 'http://localhost:5000/auth'; // Adjust as needed
  private loggedIn = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post<any>(`${this.authUrl}/login`, { email, password });
  }

  setSession(authResult: any) {
    // Set the token in local storage
    localStorage.setItem('id_token', authResult.token);
    this.loggedIn.next(true);
  }

  logout() {
    localStorage.removeItem('id_token');
    this.loggedIn.next(false);
  }

  isLoggedIn() {
    return this.loggedIn.asObservable();
  }
}
