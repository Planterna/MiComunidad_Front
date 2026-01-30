import { Component, signal } from '@angular/core';
import { FrontFooter } from '../components/front-footer/front-footer';
import { FrontNavbar } from '../components/front-navbar/front-navbar';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink],
  templateUrl: './home-page.html',
})
export class HomePage {


  recursosDis = signal(30);

}
