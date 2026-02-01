import { Routes } from '@angular/router'; 
import { HomePage } from './components/MiComunidad/home-page/home-page';
import { NotFoundPage } from './components/MiComunidad/not-found-page/not-found-page';
import { ReservaVista } from './components/MiComunidad/reservas-crud/reserva-vista/reserva-vista';
import { ReservaFormulario } from './components/MiComunidad/reservas-crud/reserva-formulario/reserva-formulario';
import { LoginComponent } from './auth/components/login/login';
import { RegisterComponent } from './auth/components/register/register';
import { AuthGuard } from './auth/guard/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomePage,
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'reserva',
    canActivate: [AuthGuard],
    component: ReservaVista,
  },
  {
    path: 'reserva/formulario',
    canActivate: [AuthGuard],
    component: ReservaFormulario,
  },
  {
    path: 'reserva/formulario/:id',
    canActivate: [AuthGuard],
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
