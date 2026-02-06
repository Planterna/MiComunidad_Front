import { Routes } from '@angular/router';
<<<<<<< HEAD
import { HomePage } from './components/MiComunidad/home-page/home-page';
import { NotFoundPage } from './components/MiComunidad/not-found-page/not-found-page';
import { ReservaVista } from './components/MiComunidad/reservas-crud/reserva-vista/reserva-vista';
import { ReservaFormulario } from './components/MiComunidad/reservas-crud/reserva-formulario/reserva-formulario'
import { HistorialUsoVista } from './components/MiComunidad/historial-uso/historial-uso-vista/historialuso_vista';
import { HistorialUsoFormulario } from './components/MiComunidad/historial-uso/historial_uso-formualrio/historialuso-formulario';

=======
import { AuthGuard } from './auth/guard/auth.guard';
>>>>>>> origin/main

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
<<<<<<< HEAD
    component: HomePage,
    pathMatch: 'full',
  },
  {
    path: 'reserva',
    component: ReservaVista,
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
    component: HomePage,
  },
  {
    path: 'historial-uso',
    component: HistorialUsoVista,
  },
   { path: 'historial-uso/formulario', component: HistorialUsoFormulario },
  
   { path: 'historial-uso/formulario/:id', component: HistorialUsoFormulario },
  
  {
    path: 'noticia',
    component: NotFoundPage,
  },
  {
    path: 'user',
    component: NotFoundPage,
  },
  {
    path: '**',
    component: NotFoundPage,
=======
    loadChildren: () => import('./components/MiComunidad/micomunidad.routes'),
>>>>>>> origin/main
  },
];
