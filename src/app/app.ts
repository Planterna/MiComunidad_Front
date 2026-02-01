import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FrontNavbar } from "./components/MiComunidad/components/front-navbar/front-navbar";
import { FrontFooter } from "./components/MiComunidad/components/front-footer/front-footer";
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FrontNavbar, FrontFooter],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  constructor(public auth: AuthService) {}
}
