import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../../../services/usuario.service';
import { ReservaService } from '../../../../services/reserva.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReservaResponse, Estado } from '../../../../models/reserva.model';
import { RecursoService } from '../../../../services/recurso.service';
import { RecursoResponse } from '../../../../models/recurso.model';
import { ModalsAlert } from '../../../shared/modals-alert/modals-alert';
import { dataInformation } from '../../../../models/tarjetas-config.model';

@Component({
  selector: 'app-reserva-formulario',
  imports: [ReactiveFormsModule, RouterLink, ModalsAlert],
  templateUrl: './reserva-formulario.html',
})
export class ReservaFormulario implements OnInit {
  //!DI
  fb = inject(FormBuilder);
  activateRoute = inject(ActivatedRoute);
  router = inject(Router);
  usuarioService = inject(UsuarioService);
  recursoService = inject(RecursoService);
  reservaService = inject(ReservaService);

  //!Config
  modalId = 'modal-reserva';
  tituloModal = signal<string>('');
  dataModal = signal<dataInformation | null>(null);
  // reservaIdForUpdate = signal<number | null>(null);

  //! Data
  reserva = signal<ReservaResponse | null>(null);
  recursoNombres = signal<RecursoResponse[] | null>(null);
  editingId = signal<number>(0);
  nombreUS = signal<string>('');
  valueUs = signal<number>(0);
  rolId = signal<string>('Administrador'); //! Importante ver con token JWt


  //!Formulario
  reservaForm = this.fb.group({
    usuarioId: ['', [Validators.required]],
    recursoId: ['', [Validators.required]],
    fecha: ['', [Validators.required]],
    horaInicio: ['', [Validators.required]],
    horaFin: ['', [Validators.required]],
    motivo: ['', [Validators.required, Validators.minLength(5)]],
    estado: ['', [Validators.required]],
    activo: [false, []],
  });

  //! Crud
  ngOnInit(): void {
    const id = this.activateRoute.snapshot.params['id'];

    if (id !== null && id > 0) {
      this.editingId.set(+id);
      this.recursoService.getRecurso().subscribe((data) => this.recursoNombres.set(data));
      this.reservaService.getReservasForId(+id).subscribe((data) => {
        this.valueUs.set(data.usuarioId);
        this.reserva.set(data);
        this.cargarNombreUser(data.usuarioId);
        this.abrirEdicion(data);
      });
    } else {
      this.recursoService.getRecurso().subscribe((data) => this.recursoNombres.set(data));
    }
  }

  cargarNombreUser(id: number) {
    return this.usuarioService
      .getNombreUsuarioPorId(id)
      .subscribe((data) => this.nombreUS.set(data));
  }

  abrirEdicion(reserva: ReservaResponse) {
    this.reservaForm.patchValue({
      usuarioId: reserva.usuarioId.toString(),
      recursoId: reserva.recursoId.toString(),
      fecha: reserva.fecha.toString(),
      horaInicio: reserva.horaInicio,
      horaFin: reserva.horaFin,
      motivo: reserva.motivo,
      estado: reserva.estado,
      activo: reserva.activo,
    });
  }

  guardar() {
    let data = this.reservaForm.value;
    let reserva: ReservaResponse = {
      usuarioId: Number(data.usuarioId),
      recursoId: Number(data.recursoId),
      fecha: data.fecha!,
      horaInicio: data.horaInicio!,
      horaFin: data.horaFin!,
      estado: data.estado!,
      motivo: data.motivo!,
      activo: data.activo!,
      fechaCreacion: new Date().toISOString(),
      fechaModificacion: new Date().toISOString(),
    };
    if (this.editingId() !== 0 ) {
      if (reserva !== null) {
        if(this.rolId() === 'Vecino' ){
          this.reservaService.updateReserva({ ...reserva, id: this.editingId()!, estado: 'Pendiente' }).subscribe(() => {
            this.modalStatusSuccess();
          });
          setTimeout(() => {
            this.router.navigate(['/reserva']);
          }, 3000);
        }
        if (this.rolId() === 'Administrador' || this.rolId() === 'Encargado') {
          this.reservaService.updateReserva({ ...reserva, id: this.editingId()! }).subscribe(() => {
            this.modalStatusSuccess();
          });
          setTimeout(() => {
            this.router.navigate(['/reserva']);
          }, 3000);
        }

      } else {
        this.modalStatusError();
      }
    } else {
      if (reserva !== null) {
        this.reservaService.createReserva(reserva).subscribe(() => {
          this.modalStatusSuccess();
          setTimeout(() => {
            this.router.navigate(['/reserva']);
          }, 3000);
        });
      } else {
        this.modalStatusError();
      }
    }
  }

  //! Modal
  abrirConfirmacion() {
    this.tituloModal.set('Confirmar');
    this.dataModal.set('confirm');
    const check = document.getElementById(`${this.modalId}`) as HTMLInputElement;
    if (check) check.checked = true;
  }

  modalStatusSuccess() {
    this.tituloModal.set('Éxitoso');
    this.dataModal.set('success');
    setTimeout(() => {
      const check = document.getElementById(`${this.modalId}`) as HTMLInputElement;
      if (check) {
        check.checked = false;
        this.dataModal.set(null);
        this.tituloModal.set('');
      }
    }, 1500);
  }

  modalStatusError() {
    this.tituloModal.set('Error');
    this.dataModal.set('error');
    setTimeout(() => {
      const check = document.getElementById(`${this.modalId}`) as HTMLInputElement;
      if (check) {
        check.checked = false;
        this.dataModal.set(null);
        this.tituloModal.set('');
      }
    }, 1500);
  }
}
