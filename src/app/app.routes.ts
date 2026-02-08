import { Routes } from '@angular/router';
import { AuthGuard } from './auth/guard/auth.guard';
import { NoAccessComponent } from './components/shared/no-access.component';
export const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./auth/auth.routes').then(m => m.default) },

  {
    path: 'admin',
    canActivate: [AuthGuard],
    data: { roles: ['Administrador', 'Encargado'] },
    loadChildren: () => import('./admin-dashboard/admin-dashboard.routes').then(m => m.default),
  },

  { path: 'no-access', component: NoAccessComponent },

  { path: '', loadChildren: () => import('./components/MiComunidad/micomunidad.routes').then(m => m.default) },
];
