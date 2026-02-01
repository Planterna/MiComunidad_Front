import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';


@Component({
  selector: 'app-front-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './front-navbar.html',
})
export class FrontNavbar {
  constructor(public auth: AuthService) {}
}
