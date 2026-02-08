import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-no-access',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="min-h-screen flex items-center justify-center px-6">
      <div class="max-w-md w-full bg-base-100 shadow-xl rounded-2xl p-8 border">
        <h2 class="text-2xl font-bold text-error mb-3">No tienes acceso</h2>
        <p class="opacity-80 mb-6">
          Tu rol no tiene permisos para entrar a esta sección.
        </p>

        <div class="flex gap-3 justify-end">
          <a routerLink="/" class="btn btn-primary">Ir al inicio</a>
          <a routerLink="/auth/login" class="btn btn-outline">Volver a iniciar sesión</a>
        </div>
      </div>
    </div>
  `,
})
export class NoAccessComponent {}
