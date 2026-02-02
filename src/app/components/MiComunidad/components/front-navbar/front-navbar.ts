import { Component, OnInit, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import { AuthService } from "../../../../services/auth.service";
import { Roles } from "../../../../models/usuario.model";
import { NgClass } from "@angular/common";



@Component({
  selector: 'app-front-navbar',
  standalone: true,
  imports: [RouterLink, NgClass],
  templateUrl: './front-navbar.html',
})
export class FrontNavbar implements OnInit {
  constructor(public auth: AuthService) {}

  rolUser = signal<Roles | null>(null);

  ngOnInit(): void {
    const rol = this.auth.getRole();

    if(rol) this.rolUser.set(rol);
  }

}
