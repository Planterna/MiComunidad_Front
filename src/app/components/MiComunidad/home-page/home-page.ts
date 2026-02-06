import { Component, inject, signal } from '@angular/core';
import { FrontFooter } from '../components/front-footer/front-footer';
import { FrontNavbar } from '../components/front-navbar/front-navbar';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink],
  templateUrl: './home-page.html',
})
export class HomePage {

authService = inject(AuthService);
rol = this.authService.getRole();
recursosDis = signal(30);


}
