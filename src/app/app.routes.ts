import { Routes } from '@angular/router';
import { HomePage } from './components/MiComunidad/home-page/home-page';
import { NotFoundPage } from './components/MiComunidad/not-found-page/not-found-page';
import { ReservaVista } from './components/MiComunidad/reservas-crud/reserva-vista/reserva-vista';
import { ReservaFormulario } from './components/MiComunidad/reservas-crud/reserva-formulario/reserva-formulario';

export const routes: Routes = [
  {
    path: '',
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
    component: HomePage,
  },
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
  },
];
