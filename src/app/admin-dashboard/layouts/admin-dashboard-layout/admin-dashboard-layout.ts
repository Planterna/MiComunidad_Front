import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { Roles } from '../../../models/usuario.model';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-dashboard-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-dashboard-layout.html',
})
export class AdminDashboardLayout {
  rolUser = signal<Roles | null>(null);
  nombreUser = signal<string>('');

  constructor(private auth: AuthService) {}

  ngOnInit(): void {
    const rol = this.auth.getRole();
    const nombres = this.auth.getNombreCompleto();

    if (rol) this.rolUser.set(rol);
    if (nombres) this.nombreUser.set(nombres);
  }

  cerrarSesion() {
    this.auth.logout();
  }
}
