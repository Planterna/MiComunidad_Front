import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { HistorialUsoService } from '../../../../services/historial-uso.service';
import { UsuarioService } from '../../../../services/usuario.service';
import { RecursoService } from '../../../../services/recurso.service';
import { estado } from '../../../../models/historial-uso.model';
import { ModalsAlert } from '../../../shared/modals-alert/modals-alert';

//  AGREGA ESTO
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-historial-uso-formulario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ModalsAlert],
  templateUrl: './historial-uso-formulario.html',
})
export class HistorialUsoFormulario implements OnInit {

  id: number | null = null;

  usuarios: any[] = [];
  recursos: any[] = [];
  estados = Object.values(estado);

  modalEstado: 'success' | 'error' | null = null;
  modalId = 'modal-historial-uso';

  private fb = inject(FormBuilder);
  private service = inject(HistorialUsoService);
  private usuarioService = inject(UsuarioService);
  private recursoService = inject(RecursoService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // AGREGA ESTO
  private auth = inject(AuthService);

  // ESTO ES LO QUE TE GRITA EL COMPILADOR
  esVecino = false;
  nombreUsuarioVecino = '';

  form = this.fb.group({
    usuarioId: ['', Validators.required],
    recursoId: ['', Validators.required],
    fechaUso: ['', Validators.required],
    horaInicio: ['', Validators.required],
    horaFin: ['', Validators.required],
    estado: ['', Validators.required],
    notas: [''],
    activo: [true]
  });

  ngOnInit(): void {
    const paramId = this.route.snapshot.paramMap.get('id');

    // definir rol
    const rol = this.auth.getRole();
    this.esVecino = rol === 'Vecino';

    // Cargar usuarios y recursos y luego edición
    this.usuarioService.getUsuarios().subscribe(r => {
      this.usuarios = r;

      //  Si es vecino, fijar usuario (id) y nombre
      if (this.esVecino) {
        const idUser = this.auth.getId();
        if (idUser != null) {
          const u = this.usuarios.find(x => Number(x.id) === Number(idUser));
          this.nombreUsuarioVecino = u ? `${u.nombres} ${u.apellidos}` : 'Usuario';
          this.form.patchValue({ usuarioId: String(idUser) });
          this.form.get('usuarioId')?.disable({ emitEvent: false }); // para que no lo cambie
        }
      }

      this.intentarCargarEdicion(paramId);
    });

    this.recursoService.getRecurso().subscribe(r => {
      this.recursos = r;
      this.intentarCargarEdicion(paramId);
    });
  }

  private yaIntentado = false;

  private intentarCargarEdicion(paramId: string | null) {
    if (!paramId) return;
    if (this.usuarios.length === 0) return;
    if (this.recursos.length === 0) return;
    if (this.yaIntentado) return;

    this.yaIntentado = true;
    this.id = Number(paramId);

    this.service.getById(this.id).subscribe(data => {
      //  OJO: si usuarioId está disabled, patchValue igual funciona si usas getRawValue al guardar
      this.form.patchValue({
        usuarioId: String(data.usuarioId),
        recursoId: String(data.recursoId),
        fechaUso: data.fechaUso,
        horaInicio: data.horaInicio,
        horaFin: data.horaFin,
        estado: data.estado,
        notas: data.notas,
        activo: data.activo
      });
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

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.form.updateValueAndValidity();
      this.guardando = false;
      return;
    }

    // IMPORTANTE: como usuarioId puede estar disabled, usa getRawValue()
    const raw = this.form.getRawValue();

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
        this.modalEstado = 'success';
        this.abrirModal();
        this.guardando = false;
      },
      error: (err) => {
        console.log('ERROR BACKEND', err);
        this.modalEstado = 'error';
        this.abrirModal();
        this.guardando = false;
      }
    });
  }

  abrirModal(): void {
    const checkbox = document.getElementById(this.modalId) as HTMLInputElement;
    if (checkbox) checkbox.checked = true;
  }

  cerrarModal(): void {
    const checkbox = document.getElementById(this.modalId) as HTMLInputElement;
    if (checkbox) checkbox.checked = false;
  }

  irListado(): void {
  this.cerrarModal();
  this.router.navigate([this.rutaListado]);
}

  // ESTO ES LO QUE TE FALTABA PARA EL TEMPLATE (confirmar)="onModalOk()"
  onModalOk(): void {
    this.irListado();
  }

  rutaListado = '/historial-uso';

private setRutaListadoPorRol(): void {
  const rol = this.auth.getRole();
  this.rutaListado =
    rol === 'Administrador' || rol === 'Encargado'
      ? '/admin/historial'
      : '/historial-uso';
}




}
