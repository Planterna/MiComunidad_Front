import { HttpClient } from "@angular/common/http";
import { Injectable, signal } from "@angular/core";
import { Router } from "@angular/router";
import { tap } from "rxjs";
import { environment } from "../../environments/environments";
import { Roles } from "../models/usuario.model";


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


  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  authSignal = signal<boolean>(this.isLoggedIn());

  // =====================
  // LOGIN
  // =====================
 login(data: LoginRequest) {
  return this.http.post<LoginResponse>(`${this.API_URL}/login`, data).pipe(
    tap(res => {
      sessionStorage.setItem(this.TOKEN_KEY, res.token);
      this.authSignal.set(true);
    })
  );
}
  // =====================
  // REGISTER
  // =====================
  register(data: any) {
    return this.http.post(`${environment.baseUrl}/Auth/crear`, data);
  }


  // =====================
  // LOGOUT
  // =====================
 logout() {
  sessionStorage.removeItem(this.TOKEN_KEY);
  this.authSignal.set(false);
  this.router.navigate(['/login']);
}

  // =====================
  // TOKEN
  // =====================
  getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }
  // =====================
  // AUTH STATE (Navbar)
  // =====================
  isLoggedIn() {
    return !!this.getToken();
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

  getRole(): Roles | null {
  const user = this.getUserFromToken();
  if (!user) return null;

  return (
    user['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] as Roles
  ) ?? null;

  }

  getEmail(): string | null {
    const user = this.getUserFromToken();
    if (!user) return null;

  return (
    user['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress']
  ) ?? null;
  }

  getId(): number | null {
  const user = this.getUserFromToken();
  if (!user) return null;

  const id =
    user['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];

  return id ? Number(id) : null;
}

  getNombreCompleto(): string | null {
  const user = this.getUserFromToken();
  if (!user) return null;
  return `${user.nombre} ${user.apellido}`;
}


}
