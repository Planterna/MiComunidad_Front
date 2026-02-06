import { Component, inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "../../../services/auth.service";


@Component({
  selector: 'app-not-found-page',
  imports: [],
  templateUrl: './not-found-page.html',
})
export class NotFoundPage {

  authService = inject(AuthService);
  route = inject(Router);

  regresar(){
    const rol = this.authService.getRole();
    if(rol){
      if(rol === 'Administrador' || rol === 'Encargado'){
        this.route.navigate(['/admin/dashboard']);
      }
      if(rol === 'Vecino'){
        this.route.navigate(['/']);
      }
    }
  }

 }
