import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { RouterModule } from '@angular/router';

import { UsuarioResponse, Estado } from '../../../../models/usuario.model';
import { UsuarioService } from '../../../../services/usuario.service';
import { ModalsAlert } from '../../../shared/modals-alert/modals-alert';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, RouterModule, ModalsAlert],
  templateUrl: './usuario-tabla.html',
})
export class UsuariosComponent implements OnInit {

  // 🔹 DI
  private usuarioService = inject(UsuarioService);

  // 🔹 Modal
  modalId = signal('modal-usuarios');
  titulo = signal('');
  data = signal<'success' | 'error' | 'confirm' | null>(null);

  // 🔹 State
  usuarios = signal<UsuarioResponse[]>([]);
  cargando = signal(true);
  usuarioSeleccionado = signal<UsuarioResponse | null>(null);

  // 🔹 Búsqueda
  busqueda = signal('');

  // 🔹 Filtro
  usuariosFiltrados = computed(() => {
    const texto = this.busqueda().toLowerCase().trim();

    if (!texto) return this.usuarios();

    return this.usuarios().filter(u =>
      u.nombres.toLowerCase().includes(texto) ||
      u.apellidos.toLowerCase().includes(texto) ||
      u.email.toLowerCase().includes(texto)
    );
  });

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  // 🔹 Obtener todos
  cargarUsuarios() {
    this.cargando.set(true);

    this.usuarioService.getNombreUsuarioCompleto().subscribe({
      next: usuarios => {
        this.usuarios.set(usuarios);
        this.cargando.set(false);
      },
      error: err => {
        console.error(err);
        this.cargando.set(false);
        this.abrirModal('error', 'Error al cargar usuarios');
      }
    });
  }

  // 🔹 Buscar
  onBuscar(event: Event) {
    this.busqueda.set((event.target as HTMLInputElement).value);
  }

  // 🔹 Confirmar activar / desactivar
  confirmarEliminar(usuario: UsuarioResponse) {
    this.usuarioSeleccionado.set(usuario);

    this.abrirModal(
      'confirm',
      usuario.estado === Estado.Activo
        ? '¿Deseas desactivar este usuario?'
        : '¿Deseas activar este usuario?'
    );
  }

  // 🔹 Activar / Desactivar
  eliminar() {
    const usuario = this.usuarioSeleccionado();
    if (!usuario || !usuario.id) return;

    const actualizado: UsuarioResponse = {
      ...usuario,
      estado:
        usuario.estado === Estado.Activo
          ? Estado.Inactivo
          : Estado.Activo,
      fechaModificacion: new Date(),
    };

    this.usuarioService
      .actualizarUsuario({ ...actualizado, id: usuario.id })
      .subscribe({
        next: () => {
          this.abrirModal('success', 'Usuario actualizado correctamente');
          this.cargarUsuarios();
        },
        error: () => {
          this.abrirModal('error', 'No se pudo actualizar el usuario');
        }
      });
  }

  // 🔹 Modal helpers
  abrirModal(tipo: 'success' | 'error' | 'confirm', titulo: string) {
    this.titulo.set(titulo);
    this.data.set(tipo);

    const check = document.getElementById(this.modalId()) as HTMLInputElement;
    if (check) check.checked = true;
  }

  cerrarModal() {
    const check = document.getElementById(this.modalId()) as HTMLInputElement;
    if (check) check.checked = false;

    this.data.set(null);
    this.titulo.set('');
    this.usuarioSeleccionado.set(null);
  }
}
