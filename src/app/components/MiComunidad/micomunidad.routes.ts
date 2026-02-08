import { Routes } from '@angular/router';
import { MicomunidadLayout } from './layouts/micomunidad-layout/micomunidad-layout';
import { HomePage } from './home-page/home-page';
import { AuthGuard } from '../../auth/guard/auth.guard';
import { NotFoundPage } from './not-found-page/not-found-page';
import { ReservaFormulario } from './reservas-crud/reserva-formulario/reserva-formulario';
import { ReservaVista } from './reservas-crud/reserva-vista/reserva-vista';
import { PerfilComponent } from './usuario-crud/perfil/perfil';

import { HistorialUsoVista } from './historial-uso/historial-uso-vista/historialuso_vista';
import { HistorialUsoFormulario } from './historial-uso/historial_uso-formualrio/historialuso-formulario';

export const miComunidadRoutes: Routes = [
  {
    path: '',
    component: MicomunidadLayout,
    children: [
      {
        path: '',
        component: HomePage,
      },

      // RESERVAS
      {
        path: 'reserva',
        canActivate: [AuthGuard],
        data: { roles: ['Vecino'] },
        component: ReservaVista,
      },
      {
        path: 'reserva/formulario',
        canActivate: [AuthGuard],
        data: { roles: ['Vecino'] },
        component: ReservaFormulario,
      },
      {
        path: 'reserva/formulario/:id',
        canActivate: [AuthGuard],
        data: { roles: ['Vecino'] },
        component: ReservaFormulario,
      },
      {
        path: 'historial-uso',
        canActivate: [AuthGuard],
        data: { roles: ['Vecino'] },
        component: HistorialUsoVista,
      },
      {
        path: 'historial-uso/formulario',
        canActivate: [AuthGuard],
        data: { roles: ['Vecino'] },
        component: HistorialUsoFormulario,
      },
      {
        path: 'historial-uso/formulario/:id',
        canActivate: [AuthGuard],
        data: { roles: ['Vecino'] },
        component: HistorialUsoFormulario,
      },

      // OTROS
      {
        path: 'recurso',
        component: NotFoundPage,
      },
      {
        path: 'noticia',
        component: NotFoundPage,
      },
      {
        path: 'user',
        component: NotFoundPage,
      },

      // PERFIL
      {
        path: 'perfil',
        component: PerfilComponent,
        data: { roles: ['Vecino'] },
        canActivate: [AuthGuard],
      },

      {
        path: 'not-found',
        component: NotFoundPage,
      },
      {
        path: '**',
        component: NotFoundPage,
      },
    ],
  },

  {
    path: '**',
    redirectTo: '',
  },
];

export default miComunidadRoutes;
