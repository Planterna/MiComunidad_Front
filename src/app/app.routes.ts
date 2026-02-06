import { Routes } from '@angular/router';
import { AuthGuard } from './auth/guard/auth.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin-dashboard/admin-dashboard.routes'),

  },
  {
    path: '',
    loadChildren: () => import('./components/MiComunidad/micomunidad.routes'),
  },
];
