import { Component, OnInit, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { FrontFooter } from "./components/MiComunidad/components/front-footer/front-footer";
import { FrontNavbar } from "./components/MiComunidad/components/front-navbar/front-navbar";
import { AuthService } from "./services/auth.service";
import { Roles } from "./models/usuario.model";



@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FrontNavbar, FrontFooter],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit{
  constructor(public auth: AuthService) {}
  rolUser = signal<Roles | null>(null)

  ngOnInit():void{
    const rol = this.auth.getRole();

    if(rol) return this.rolUser.set(rol);
  }
  

}
