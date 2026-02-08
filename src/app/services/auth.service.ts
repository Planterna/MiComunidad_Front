import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { environment } from '../../environments/environments';
import { Roles } from '../models/usuario.model';

interface LoginRequest {
  email: string;
  passHash: string;
}

interface LoginResponse {
  token: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = `${environment.baseUrl}/Auth`;
  private readonly TOKEN_KEY = 'token';

  authSignal = signal<boolean>(this.isLoggedIn());

  constructor(private http: HttpClient, private router: Router) {}

  login(data: LoginRequest) {
    return this.http.post<LoginResponse>(`${this.API_URL}/login`, data).pipe(
      tap((res) => {
        sessionStorage.setItem(this.TOKEN_KEY, res.token);
        this.authSignal.set(true);
      }),
    );
  }

  register(data: any) {
    return this.http.post(`${this.API_URL}/crear`, data);
  }

  logout() {
    sessionStorage.removeItem(this.TOKEN_KEY);
    this.authSignal.set(false);
    this.router.navigate(['/auth/login']);
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const payload = this.getUserFromToken();
    const exp = payload?.exp;

    if (!exp) return true; // si no hay exp, lo damos como válido
    const now = Math.floor(Date.now() / 1000);
    return exp > now;
  }

  private decodeBase64Url(base64Url: string): string {
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    return atob(padded);
  }

  getUserFromToken(): any | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      const json = this.decodeBase64Url(payload);
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  getRole(): Roles | null {
    const user = this.getUserFromToken();
    if (!user) return null;

    const raw =
      user['role'] ||
      user['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

    const role = (raw ?? '').toString().trim();
    return (role as Roles) ?? null;
  }

  getEmail(): string | null {
    const user = this.getUserFromToken();
    if (!user) return null;

    const raw =
      user['email'] ||
      user['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];

    return (raw ?? '').toString().trim() || null;
  }

  getId(): number | null {
    const user = this.getUserFromToken();
    if (!user) return null;

    const raw =
      user['sub'] ||
      user['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];

    const id = (raw ?? '').toString().trim();
    return id ? Number(id) : null;
  }

  getNombreCompleto(): string | null {
    const user = this.getUserFromToken();
    if (!user) return null;

    const nombre = (user['nombre'] ?? '').toString().trim();
    const apellido = (user['apellido'] ?? '').toString().trim();

    const full = `${nombre} ${apellido}`.trim();
    return full || null;
  }
}
