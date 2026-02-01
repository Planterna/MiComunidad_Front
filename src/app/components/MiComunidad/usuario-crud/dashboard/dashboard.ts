import { Component } from '@angular/core';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
})
export class DashboardComponent {

  nombreAdmin = '';
  rol = '';

  constructor(private auth: AuthService) {
    const user = this.auth.getUserFromToken();

    if (user) {
      this.nombreAdmin = `${user.nombre} ${user.apellido}`;
      this.rol =
        user['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    }
  }
}
