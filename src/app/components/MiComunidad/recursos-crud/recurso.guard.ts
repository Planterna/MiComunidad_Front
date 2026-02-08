import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot } from "@angular/router";
import { AuthService } from "../../../services/auth.service";

@Injectable({ providedIn: 'root' })
export class RecursoGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}
  
  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/auth/login']);
      return false;
    }
    
    const allowedRoles = route.data?.['roles'] as string[] | undefined;
    const userRole = this.authService.getRole();
    
    if (allowedRoles && (!userRole || !allowedRoles.includes(userRole))) {
      alert('Acceso denegado: tu rol no tiene permiso.');
      this.router.navigate(['/recurso']);
      return false;
    }
    
    return true;
  }
}
