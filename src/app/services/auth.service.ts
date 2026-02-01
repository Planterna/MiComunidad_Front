import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environments';

interface LoginRequest {
  email: string;
  passHash: string;
}

interface LoginResponse {
  token: string;
}
const baseUrl = environment.baseUrl;

@Injectable({
  providedIn: 'root'
})



export class AuthService {

  private readonly API_URL = `${baseUrl}/Auth`;
  private readonly TOKEN_KEY = 'token';

  private loggedIn$ = new BehaviorSubject<boolean>(this.hasToken());

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  // =====================
  // LOGIN
  // =====================
  login(data: LoginRequest) {
    return this.http
      .post<LoginResponse>(`${this.API_URL}/login`, data)
      .pipe(
        tap(res => {
          localStorage.setItem(this.TOKEN_KEY, res.token);
          this.loggedIn$.next(true);
        })
      );
  }
  // =====================
  // REGISTER
  // =====================
  register(data: any) {
    return this.http.post(`${this.API_URL}/crear`, data);
  }

  // =====================
  // LOGOUT
  // =====================
  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    this.loggedIn$.next(false);
    this.router.navigate(['/login']);
  }

  // =====================
  // TOKEN
  // =====================
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  hasToken(): boolean {
    return !!this.getToken();
  }

  // =====================
  // AUTH STATE (Navbar)
  // =====================
  isLoggedIn() {
    return this.loggedIn$.asObservable();
  }

  // =====================
  // DECODE JWT (sin librerías)
  // =====================
  getUserFromToken(): any | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      return null;
    }
  }

  getRole(): string | null {
    const user = this.getUserFromToken();
    return user?.role || null;
  }

  getEmail(): string | null {
    const user = this.getUserFromToken();
    return user?.email || null;
  }

  getNombreCompleto(): string | null {
  const user = this.getUserFromToken();
  if (!user) return null;
  return `${user.nombre} ${user.apellido}`;
}


}
