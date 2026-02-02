import { Component, OnInit, signal } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';
import { Roles } from '../../../../models/usuario.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  imports: [],
})
export class DashboardComponent implements OnInit {
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
