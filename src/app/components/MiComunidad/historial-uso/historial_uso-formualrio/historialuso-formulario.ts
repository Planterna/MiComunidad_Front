import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { HistorialUsoService } from '../../../../services/historial-uso.service';
import { UsuarioService } from '../../../../services/usuario.service';
import { RecursoService } from '../../../../services/recurso.service';
import { estado } from '../../../../models/historial-uso.model';

import { ModalsAlert } from '../../../shared/modals-alert/modals-alert';
import { dataInformation } from '../../../../models/tarjetas-config.model';

import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-historial-uso-formulario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ModalsAlert],
  templateUrl: './historial-uso-formulario.html',
})
export class HistorialUsoFormulario implements OnInit {

  private fb = inject(FormBuilder);
  private service = inject(HistorialUsoService);
  private usuarioService = inject(UsuarioService);
  private recursoService = inject(RecursoService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);

  id: number | null = null;

  usuarios: any[] = [];
  recursos: any[] = [];
  estados = Object.values(estado);

  // ====== ROLES ======
  esVecino = false;
  nombreUsuarioVecino = '';

  // ====== MODAL (usar signals igual que tu ModalsAlert) ======
  modalId = signal<string>('modal-historial-uso');
  modalTipo = signal<dataInformation | null>(null); // 'confirm' | 'success' | 'error'
  modalTitulo = signal<string>('Mensaje');

  // para el confirm
  private pendingAction: (() => void) | null = null;

  // ====== rutas por rol ======
  rutaListado = computed(() => {
    const rol = this.auth.getRole();
    return (rol === 'Administrador' || rol === 'Encargado') ? '/admin/historial' : '/historial-uso';
  });

  form = this.fb.group({
    usuarioId: ['', Validators.required],
    recursoId: ['', Validators.required],
    fechaUso: ['', Validators.required],
    horaInicio: ['', Validators.required],
    horaFin: ['', Validators.required],
    estado: ['', Validators.required],
    notas: [''],
    activo: [true],
  });

  ngOnInit(): void {
    const paramId = this.route.snapshot.paramMap.get('id');
    this.id = paramId ? Number(paramId) : null;

    const rol = this.auth.getRole();
    this.esVecino = rol === 'Vecino';

    // Si es vecino y está en "Nuevo", no debe poder crear
    // (igual lo bloqueamos en guardar, aquí solo dejamos UI lista)

    // Cargar usuarios
    this.usuarioService.getUsuarios().subscribe({
      next: (r) => {
        this.usuarios = r;

        // Si es vecino, fijar usuarioId + nombre y bloquear el select
        if (this.esVecino) {
          const idUser = this.auth.getId();
          if (idUser != null) {
            const u = this.usuarios.find(x => Number(x.id) === Number(idUser));
            this.nombreUsuarioVecino = u ? `${u.nombres} ${u.apellidos}` : 'Usuario';

            this.form.patchValue({ usuarioId: String(idUser) });
            this.form.get('usuarioId')?.disable({ emitEvent: false });
          }
        }

        this.intentarCargarEdicion();
      },
      error: () => {
        this.usuarios = [];
        this.intentarCargarEdicion();
      }
    });

    // Cargar recursos
    this.recursoService.getRecurso().subscribe({
      next: (r) => {
        this.recursos = r;
        this.intentarCargarEdicion();
      },
      error: () => {
        this.recursos = [];
        this.intentarCargarEdicion();
      }
    });
  }

  private yaIntentado = false;

  private intentarCargarEdicion(): void {
    if (this.yaIntentado) return;

    // Solo editar si hay id
    if (!this.id) return;

    // Espera a que usuarios y recursos ya estén cargados
    if (this.usuarios.length === 0) return;
    if (this.recursos.length === 0) return;

    this.yaIntentado = true;

    this.service.getById(this.id).subscribe({
      next: (data) => {
        this.form.patchValue({
          usuarioId: String(data.usuarioId),
          recursoId: String(data.recursoId),
          fechaUso: data.fechaUso,
          horaInicio: data.horaInicio,
          horaFin: data.horaFin,
          estado: data.estado,
          notas: data.notas,
          activo: data.activo,
        });
      },
      error: () => {
        this.abrirModal('error', 'No se pudo cargar el registro');
      }
    });
  }

  trackById(_: number, item: any) {
    return item.id;
  }

  submitted = false;

  isInvalid(control: string): boolean {
    const c = this.form.get(control);
    return !!(c && c.invalid && (c.touched || c.dirty || this.submitted));
  }

  guardando = false;

  guardar(): void {
    if (this.guardando) return;
    this.guardando = true;

    this.submitted = true;

    // ====== BLOQUEO: Vecino NO puede crear (solo editar) ======
    // crear = cuando id es null
    if (this.esVecino && !this.id) {
      this.guardando = false;
      this.abrirModal('error', 'No tienes acceso para agregar registros');
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.form.updateValueAndValidity();
      this.guardando = false;
      return;
    }

    const raw = this.form.getRawValue(); // incluye usuarioId aunque esté disabled

    const payload = {
      id: this.id ?? undefined,
      usuarioId: Number(raw.usuarioId),
      recursoId: Number(raw.recursoId),
      fechaUso: (raw.fechaUso ?? '').toString().slice(0, 10),
      horaInicio: (raw.horaInicio ?? '').toString().slice(0, 5),
      horaFin: (raw.horaFin ?? '').toString().slice(0, 5),
      estado: raw.estado ?? '',
      notas: raw.notas ?? '',
      activo: raw.activo ?? true,
      fechaModificacion: new Date().toISOString(),
    };

    const accion = this.id
      ? this.service.update(payload as any)
      : this.service.create(payload as any);

    accion.subscribe({
      next: () => {
        this.guardando = false;
        this.abrirModal('success', this.id ? 'Registro actualizado con éxito' : 'Registro guardado con éxito');
      },
      error: () => {
        this.guardando = false;
        this.abrirModal('error', 'Error: no se pudo guardar el registro');
      },
    });
  }

  // ====== MODAL CONTROL (checkbox) ======
  private abrirModal(tipo: dataInformation, titulo: string, action?: () => void) {
    this.modalTipo.set(tipo);
    this.modalTitulo.set(titulo);
    this.pendingAction = action ?? null;

    const el = document.getElementById(this.modalId()) as HTMLInputElement | null;
    if (el) el.checked = true;
  }

  private cerrarModal() {
    const el = document.getElementById(this.modalId()) as HTMLInputElement | null;
    if (el) el.checked = false;
  }

  // El shared emite confirmar SOLO cuando es confirm
  confirmarAccion(): void {
    const fn = this.pendingAction;
    this.pendingAction = null;
    this.cerrarModal();
    if (fn) fn();
  }

  // Para success y error, tu modal solo muestra OK, no emite confirmar.
  // Entonces aquí hacemos un método para cerrar y navegar manualmente si quieres:
  onModalOk(): void {
    this.cerrarModal();
    this.router.navigate([this.rutaListado()]);
  }

  regresar(): void {
    this.router.navigate([this.rutaListado()]);
  }

}
