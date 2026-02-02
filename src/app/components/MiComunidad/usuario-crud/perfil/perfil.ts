import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../environments/environments';
import { AuthService } from '../../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  selector: 'app-perfil',
  templateUrl: './perfil.html'
})

export class PerfilComponent implements OnInit {
  
guardar() {
  const userId = this.auth.getId();

  if (!userId) {
    alert('No se pudo identificar al usuario');
    return;
  }

  this.http.put(
    `${environment.baseUrl}/Usuarios/${userId}`,
    this.usuario
  ).subscribe({
    next: () => {
      alert('Perfil actualizado correctamente');
    },
    error: () => {
      alert('Error al actualizar el perfil');
    }
  });
}

  usuario: any = null;
  cargando = true;

  private API_URL = `${environment.baseUrl}/Usuarios`;

  constructor(
    private auth: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const userId = this.auth.getId();

    if (!userId) {
      console.error('No hay ID de usuario en el token');
      this.cargando = false;
      return;
    }

    this.obtenerPerfil(userId);
  }

  obtenerPerfil(id: number) {
    this.http.get(`${this.API_URL}/${id}`).subscribe({
      next: (res) => {
        this.usuario = res;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al obtener perfil', err);
        this.cargando = false;
      }
    });
  }
}
