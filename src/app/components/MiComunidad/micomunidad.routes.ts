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
import { RecursoVista } from './recursos-crud/recurso-vista/recurso-vista';
import { RecursoFormulario } from './recursos-crud/recurso-formulario/recurso-formulario';

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
        data: { roles: ['Administrador', 'Encargado', 'Vecino'] },
        component: ReservaVista,
      },
      {
        path: 'reserva/formulario',
        canActivate: [AuthGuard],
        data: { roles: ['Administrador', 'Encargado', 'Vecino'] },
        component: ReservaFormulario,
      },
      {
        path: 'reserva/formulario/:id',
        canActivate: [AuthGuard],
        data: { roles: ['Administrador', 'Encargado', 'Vecino'] },
        component: ReservaFormulario,
      },
      {
        path: 'recurso',
        canActivate: [AuthGuard],
        data: { roles: ['Administrador', 'Encargado', 'Vecino'] },
        component: RecursoVista,
      },
      {
        path: 'recurso/formulario',
        canActivate: [AuthGuard],
        data: { roles: ['Administrador', 'Encargado'] },
        component: RecursoFormulario,
      },
      {
        path: 'recurso/formulario/:id',
        canActivate: [AuthGuard],
        data: { roles: ['Administrador', 'Encargado'] },
        component: RecursoFormulario,
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
