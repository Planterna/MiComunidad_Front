import { Component, OnInit, signal } from "@angular/core";
import { RouterLink } from "@angular/router";
import { AuthService } from "../../../../services/auth.service";
import { Roles } from "../../../../models/usuario.model";



@Component({
  selector: 'app-front-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './front-navbar.html',
})
export class FrontNavbar {
  constructor(public auth: AuthService) {}


}
