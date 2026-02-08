import { Injectable } from "@angular/core";
import { CanActivate, Router, ActivatedRouteSnapshot } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { Roles } from "../../models/usuario.model";

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}canActivate(route: ActivatedRouteSnapshot): boolean {
  if (!this.authService.isLoggedIn()) {
    this.router.navigate(['/auth/login']);
    return false;
  }

  const allowedRoles = route.data?.['roles'] as string[] | undefined;
  const userRole = this.authService.getRole();

  if (allowedRoles && (!userRole || !allowedRoles.includes(userRole))) {
    this.router.navigate(['/not-found']);
    return false;
  }

  return true;
}

}
