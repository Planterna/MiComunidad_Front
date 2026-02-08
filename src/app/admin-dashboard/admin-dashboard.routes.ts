import { Routes } from '@angular/router';
import { AdminDashboardLayout } from './layouts/admin-dashboard-layout/admin-dashboard-layout';
import { AuthGuard } from '../auth/guard/auth.guard';
import { AdminHome } from './admin-home/admin-home';
import { ReservaData } from '../components/MiComunidad/reservas-crud/reserva-data/reserva-data';
import { ReservaFormulario } from '../components/MiComunidad/reservas-crud/reserva-formulario/reserva-formulario';
import { PerfilComponent } from '../components/MiComunidad/usuario-crud/perfil/perfil';
import { UsuariosComponent } from '../components/MiComunidad/usuario-crud/usuario-tabla/usuario-tabla';
import { RecursoData } from '../components/MiComunidad/recursos-crud/recurso-data/recurso-data';
import { RecursoFormulario } from '../components/MiComunidad/recursos-crud/recurso-formulario/recurso-formulario';

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
      {
        path: 'recurso',
        component: RecursoData,
      },
      {
        path: 'recurso/formulario',
        component: RecursoFormulario,
      },
      {
        path: 'recurso/formulario/:id',
        component: RecursoFormulario,
      },
      {
        path: 'perfil/:id',
        component: PerfilComponent,
      },
      {
        path: 'usuario',
        component: UsuariosComponent,
      },
      {
        path: '**',
        redirectTo: 'dashboard',
      },
    ],
  },
];
export default adminDashboardRoutes;
