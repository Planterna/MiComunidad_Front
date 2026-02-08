import { Component, OnInit, signal } from '@angular/core';
import { FrontNavbar } from '../../components/front-navbar/front-navbar';
import { FrontFooter } from '../../components/front-footer/front-footer';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { Roles } from '../../../../models/usuario.model';

@Component({
  selector: 'app-micomunidad-layout',
  imports: [FrontNavbar, FrontFooter, RouterOutlet],
  templateUrl: './micomunidad-layout.html',
})
export class MicomunidadLayout implements OnInit {
  constructor(public auth: AuthService) {}
  rolUser = signal<Roles | null>(null);

  ngOnInit(): void {
    const rol = this.auth.getRole();

    if (rol) return this.rolUser.set(rol);
  }
}
