import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { HistorialUsoService } from '../../../../services/historial-uso.service';
import { UsuarioService } from '../../../../services/usuario.service';
import { RecursoService } from '../../../../services/recurso.service';
import { estado } from '../../../../models/historial-uso.model';
import { ModalsAlert } from '../../../shared/modals-alert/modals-alert';

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
    this.usuarioService.getUsuarios().subscribe(r => this.usuarios = r);
    this.recursoService.getRecurso().subscribe(r => this.recursos = r);

    const paramId = this.route.snapshot.paramMap.get('id');
    if (paramId) {
      this.id = Number(paramId);
      this.service.getById(this.id).subscribe(data => {
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
  }

  trackById(_: number, item: any) {
    return item.id;
  }
submitted = false;
isInvalid(control: string): boolean {
  const c = this.form.get(control);
  return !!(c && c.invalid && (c.touched || c.dirty || this.submitted));
}

guardar(): void {
  this.submitted = true;

  if (this.form.invalid) {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
    return;
  }

  const payloadBase = {
    usuarioId: Number(this.form.value.usuarioId),
    recursoId: Number(this.form.value.recursoId),
    fechaUso: (this.form.value.fechaUso ?? '').toString().slice(0, 10),
    horaInicio: (this.form.value.horaInicio ?? '').toString().slice(0, 5),
    horaFin: (this.form.value.horaFin ?? '').toString().slice(0, 5),
    estado: this.form.value.estado ?? '',
    notas: this.form.value.notas ?? '',
    activo: this.form.value.activo ?? true
  };

  const accion = this.id
    ? this.service.update(this.id, { ...payloadBase, id: this.id })
    : this.service.create(payloadBase);

  accion.subscribe({
    next: () => {
      this.modalEstado = 'success';
      this.abrirModal();
    },
    error: (err) => {
      console.log('ERROR BACKEND', err);
      this.modalEstado = 'error';
      this.abrirModal();
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
    this.router.navigate(['/historial-uso']);
  }
}
