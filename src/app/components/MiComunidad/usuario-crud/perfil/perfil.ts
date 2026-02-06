import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../services/auth.service';
import { UsuarioService } from '../../../../services/usuario.service';
import { Roles, UsuarioResponse } from '../../../../models/usuario.model';
import { ModalsAlert } from "../../../shared/modals-alert/modals-alert";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalsAlert],
  templateUrl: './perfil.html',
})
export class PerfilComponent implements OnInit {

  //! DI
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  usuarioService = inject(UsuarioService);
  activeroute = inject(ActivatedRoute);

  modalId = signal<string>('modal-perfil');
  titulo = signal<string>('');
  data = signal<'success' | 'error' | 'confirm' | null>(null);


  //! State
  usuario = signal<UsuarioResponse | null>(null);
  usuarioId = signal<number | null>(null);
  cargando = signal<boolean>(true);
  rolId = signal<Roles | null>(null);

  //! Formulario
  perfilForm = this.fb.group({
    cedula: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    nombres: ['', [Validators.required, Validators.minLength(3)]],
    apellidos: ['', [Validators.required, Validators.minLength(3)]],
    telefono: ['', [Validators.required]],
    direccion: ['', [Validators.required]],
    aceptaNotificaciones: [false],
  });

  //! Init
ngOnInit(): void {

  const role = this.authService.getRole();     // Rol del usuario logueado
  const myId = this.authService.getId();       // ID del usuario logueado
  const routeId = Number(this.activeroute.snapshot.paramMap.get('id'));

  let idFinal: number | null = null;

  // ADMIN / ENCARGADO → puede abrir cualquier perfil
  if (role === 'Administrador' || role === 'Encargado') {
    if (!routeId) {
      console.error('No se proporcionó ID en la ruta');
      this.cargando.set(false);
      return;
    }
    idFinal = routeId;
  }

  // USUARIO NORMAL → solo su propio perfil
  else {
    if (!myId) {
      console.error('Usuario no autenticado');
      this.cargando.set(false);
      return;
    }
    idFinal = myId;
  }

  // Guardamos datos
  this.usuarioId.set(idFinal);
  this.rolId.set(role);

  // Cargar perfil
  this.usuarioService.getUsuarioPorId(idFinal).subscribe({
    next: (data) => {
      this.usuario.set(data);
      this.cargarFormulario(data);
      this.cargando.set(false);
    },
    error: (err) => {
      console.error('Error al obtener perfil', err);
      this.cargando.set(false);
    }
  });
}


  //! Cargar data al form
  cargarFormulario(usuario: UsuarioResponse) {
    this.perfilForm.patchValue({
      cedula: usuario.cedula,
      email: usuario.email,
      nombres: usuario.nombres,
      apellidos: usuario.apellidos,
      telefono: usuario.telefono,
      direccion: usuario.direccion,
      aceptaNotificaciones: usuario.aceptaNotificaciones,
    });
  }

  //! Guardar
  guardar() {
    if (this.perfilForm.invalid) {
      this.perfilForm.markAllAsTouched();
      return;
    }

    const id = this.usuarioId();

    if (!id) {
      alert('No se pudo identificar al usuario');
      return;
    }

    const data = this.perfilForm.value;

    const usuarioActualizado: UsuarioResponse = {
      cedula: data.cedula!,
      nombres: data.nombres!,
      apellidos: data.apellidos!,
      email: data.email!,
      passHash: this.usuario()?.passHash!,
      telefono: data.telefono!,
      direccion: data.direccion!,
      aceptaNotificaciones: data.aceptaNotificaciones!,
      fechaModificacion: new Date(),
      rolId: this.usuario()?.rolId,
      estado: this.usuario()?.estado,
      fechaCreacion: this.usuario()?.fechaCreacion,
    };

    console.log('Usuario a actualizar:', usuarioActualizado);

    
    this.usuarioService.actualizarUsuario({...usuarioActualizado, id:id}).subscribe({
      next: () => {
        this.abrirModal('success', 'Perfil actualizado');
      },
      error: () => {
        this.abrirModal('error', 'Error al actualizar perfil');
      }
    });
  }

  abrirModal(tipo: 'success' | 'error', titulo: string) {
  this.titulo.set(titulo);
  this.data.set(tipo);

  const check = document.getElementById(this.modalId()) as HTMLInputElement;
  if (check) check.checked = true;

  setTimeout(() => this.cerrarModal(), 2000);
}

cerrarModal() {
  const check = document.getElementById(this.modalId()) as HTMLInputElement;
  if (check) check.checked = false;

  this.data.set(null);
  this.titulo.set('');
}

}
