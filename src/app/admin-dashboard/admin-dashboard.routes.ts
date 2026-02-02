import { Routes } from '@angular/router';
import { AdminDashboardLayout } from './layouts/admin-dashboard-layout/admin-dashboard-layout';
import { AuthGuard } from '../auth/guard/auth.guard';
import { AdminHome } from './admin-home/admin-home';
import { ReservaData } from '../components/MiComunidad/reservas-crud/reserva-data/reserva-data';
import { ReservaFormulario } from '../components/MiComunidad/reservas-crud/reserva-formulario/reserva-formulario';

export const adminDashboardRoutes: Routes = [
  {
    path: '',
    component: AdminDashboardLayout,
    canActivate: [AuthGuard],
    data: { roles: ['Administrador', 'Encargado'] },
    children: [
      {
        path: 'dashboard',
        component: AdminHome,
      },
      {
        path: 'reserva',
        component: ReservaData,
      },
      {
        path: 'reserva/formulario',
        component: ReservaFormulario,
      },
      {
        path: 'reserva/formulario/:id',
        component: ReservaFormulario,
      },

      //! Añadir para el resto de campos del dashboard, tambien se usa la misma ruta que las paginas normales para usuario
      // {
      //   path: 'recurso',
      //   component: RecursosAdmin,
      // },
      {
        path: '**',
        redirectTo: 'dashboard',
      },
    ],
  },
];
export default adminDashboardRoutes;
