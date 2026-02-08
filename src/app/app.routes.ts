import { Routes } from '@angular/router';
import { AuthGuard } from './auth/guard/auth.guard';

export const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./auth/auth.routes').then(m => m.default) },
  { path: 'admin', loadChildren: () => import('./admin-dashboard/admin-dashboard.routes').then(m => m.default) },
  { path: '', loadChildren: () => import('./components/MiComunidad/micomunidad.routes').then(m => m.default) },
];
